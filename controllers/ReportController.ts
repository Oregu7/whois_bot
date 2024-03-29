import { Context } from 'telegraf';

import { PAGINATE_REPORT_ACTION } from '../shared/core/actions/Action';
import { CbAction, Controller, Hears, OnUpdate } from '../shared/core/bot/Controller';
import { Messages } from '../shared/messages';
import { SearchHistoryEntity, UserEntity } from '../shared/models';
import { ContextMatch } from '../shared/models/types';
import { MosGorsudService, SearchParams } from '../shared/services/MosGorsudService';


export class ReportController extends Controller {

	@Hears(/^\d+ ₽ - (\d+) отчет(ов)?$/)
	static async buyReports(ctx: ContextMatch) {
		const reportsCount: number = Number(ctx.match[1]);

		const user = await UserEntity.findOne(ctx.from?.id);

		if (user !== undefined) {
			user.balance += reportsCount;
			await user.save();
		}

		const { message, extra } = Messages.report.buyReports(reportsCount);

		await ctx.reply(message, extra);
	}

	@Hears('Остаток отчетов')
	static async showBalance(ctx: Context) {
		const user = await UserEntity.findOne(ctx.from?.id);

		const { message, extra } = Messages.report.balance(user!);

		await ctx.reply(message, extra);
	}

	@Hears('Промокод')
	static async promoCode(ctx: Context) {
		const { message, extra } = Messages.report.promoCode();

		await ctx.reply(message, extra);
	}

	@OnUpdate('message')
	static async generateReport(ctx: Context) {
		const text = ((ctx.message as any).text ?? '').trim();
		const searchParams: SearchParams = {};

		if (/^\d+$/.test(text)) {
			searchParams.caseNumber = text;
		} else {
			searchParams.q = text;
		}

		const { list, pages, total } = await MosGorsudService.search(searchParams);

		if (list.length === 0) {
			const { message, extra } = Messages.report.notFound();

			await ctx.reply(message, extra);

			return;
		}

		const searchHistory = await SearchHistoryEntity.createSearchHistory(ctx, text, total);

		const { message, extra } = Messages.report.generateReport(list.slice(0, 10), { page: 1, pages, searchId: searchHistory.id });

		await ctx.reply(message, extra);
	}

	@CbAction(PAGINATE_REPORT_ACTION, '\\d+', '\\d+')
	static async paginateReport(ctx: ContextMatch) {
		const [, page, searchId] = ctx.match;

		const searchHistory = await SearchHistoryEntity.findOne(searchId);

		const searchParams: SearchParams = {
			q: searchHistory?.searchText,
			page: Number(page),
		};

		const { list, pages } = await MosGorsudService.search(searchParams);

		if (list.length === 0) {
			const { message, extra } = Messages.report.notFound();

			await ctx.editMessageText(message, extra as any);

			return;
		}

		const { message, extra } = Messages.report.generateReport(list.slice(0, 10), { page: Number(page), pages, searchId: searchHistory!.id });

		await ctx.editMessageText(message, extra as any);
	}
}
