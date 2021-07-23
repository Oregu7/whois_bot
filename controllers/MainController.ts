import { Context } from 'telegraf';

import { Controller, Command, Pattern } from '../shared/core/bot/Controller';
import { Messages } from '../shared/messages';
import { PromocodeEntity, UserEntity } from '../shared/models';
import { ContextMatch, PromocodeStatus } from '../shared/models/types';

export class MainController extends Controller {

	@Command('start')
	static async start(ctx: Context) {
		const { text = '', entities = [] } = ctx.message as any;

		const user = await UserEntity.getOrCreateFromCTX(ctx);

		if (entities.legth === 0) {
			const { message, extra } = Messages.main.start();
			await ctx.reply(message, extra);

			return;
		}
	
		const promoToken = text.slice(entities[0].length).trim();

		const promocode = await PromocodeEntity.findOne({ token: promoToken });

		if (promocode === undefined) {
			await ctx.replyWithHTML(`Промокод: <b>${promoToken}</b> не найден!`);

			return;
		}

		if (promocode.status !== PromocodeStatus.active) {
			await ctx.replyWithHTML(`Промокод: <b>${promoToken}</b> уже активирован!`);

			return;
		}

		promocode.status = PromocodeStatus.done;
		promocode.userID = ctx.from!.id;
		await promocode.save();

		user.balance += promocode.balance;
		await user.save();

		await ctx.replyWithHTML(`Вы успешно активировали Промокод на: <b>${promocode.balance}</b> отчет(ов).\n\n Ваш текщий баланс: <b>${user.balance}</b>`);
	}

	@Command('settings')
	static async settings(ctx: Context) {
		const { message, extra } = Messages.main.settings();

		await ctx.reply(message, extra);
	}

	@Pattern('Как пользоваться')
	@Command('help')
	static async help(ctx: Context) {
		const { message, extra } = Messages.main.start();

		await ctx.reply(message, extra);
	}

	@Command('report')
	static async report(ctx: Context) {
		const { message, extra } = Messages.main.report();

		await ctx.reply(message, extra);
	}

	@Pattern(/^\/promo (\d+)$/)
	static async createPromocodes(ctx: ContextMatch) {
		const promocodesCount: number = Number(ctx.match[1]);
		const promocodes: PromocodeEntity[] = [];

		let promocodeMessage = '';

		for (let i = 0; i < promocodesCount; i++) {
			const promocode = new PromocodeEntity();
			promocode.adminID = ctx.from!.id;

			promocodeMessage += `${promocode.token}\n`;

			promocodes.push(promocode);
		}

		await PromocodeEntity.insert(promocodes);

		await ctx.reply(promocodeMessage);
	}
}
