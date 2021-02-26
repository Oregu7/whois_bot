import { Context, Extra, Markup } from 'telegraf';

import { Controller, Pattern } from '../shared/core/bot/Controller';
import { UserEntity } from '../shared/models';

export class ReportController extends Controller {

	@Pattern(/^\d+ р - (\d+) отчет(ов)?$/)
	static async buyReports(ctx: Context) {
		const reportsCount: number = Number(ctx.match![1]);

		const user = await UserEntity.findOne(ctx.from?.id);

		if (user !== undefined) {
			user.balance += reportsCount;
			await user.save();
		}

		const message = `Покупка ${reportsCount} отчетов. Подтвердите оплату в Робокассе`;
		const keyboard = Markup.inlineKeyboard([
			Markup.urlButton('Ссылка на робокассу', 'https://robokassa.com'),
		]);

		await ctx.replyWithHTML(message, Extra.markup(keyboard));
	}

	@Pattern('Остаток запросов')
	static async showBalance(ctx: Context) {
		const user = await UserEntity.findOne(ctx.from?.id);

		const userBalance = user?.balance || 0;

		const message = `Остаток ваших запроосв: ${userBalance}`;

		await ctx.replyWithHTML(message);
	}

	@Pattern('Промокод')
	static async promoCode(ctx: Context) {
		const message = 'Вы можете активировать промокод, чтобы пополнить кол-во доступных отчетов.';

		await ctx.replyWithHTML(message);
	}
}
