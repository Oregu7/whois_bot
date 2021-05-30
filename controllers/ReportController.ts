import { Context } from 'telegraf';

import { Controller, Pattern } from '../shared/core/bot/Controller';
import { Messages } from '../shared/messages';
import { UserEntity } from '../shared/models';


type ContextMatch = Context & { match: RegExpExecArray };

export class ReportController extends Controller {

	@Pattern(/^\d+ р - (\d+) отчет(ов)?$/)
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

	@Pattern('Остаток запросов')
	static async showBalance(ctx: Context) {
		const user = await UserEntity.findOne(ctx.from?.id);

		const { message, extra } = Messages.report.balance(user!);

		await ctx.reply(message, extra);
	}

	@Pattern('Промокод')
	static async promoCode(ctx: Context) {
		const { message, extra } = Messages.report.promoCode();

		await ctx.reply(message, extra);
	}
}
