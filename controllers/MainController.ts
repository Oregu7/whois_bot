import { Context } from 'telegraf';
import { getConnection } from 'typeorm';

import { Controller, Command, Pattern } from '../shared/core/bot/Controller';
import { Messages } from '../shared/messages';
import { PromoCodeEntity, UserEntity } from '../shared/models';
import { ContextMatch, PromocodeStatus } from '../shared/models/types';
import { config } from '../shared/config';

export class MainController extends Controller {

	@Command('start')
	static async start(ctx: Context) {
		const { text = '', entities = [] } = ctx.message as any;
		
		// 1.
		const user = await UserEntity.getOrCreateFromCTX(ctx);

		if (entities[0]?.length === text.length) {
			const { message, extra } = Messages.main.start();
			await ctx.reply(message, extra);

			return;
		}
	
		// 2.
		const promoToken = text.slice(entities[0].length).trim();
		const promocode = await PromoCodeEntity.findOne({ token: promoToken });
		const { extra: mainMessageExtra } = Messages.main.start();

		if (promocode === undefined) {
			const { message, extra } = Messages.promocode.notFound(promoToken);
			await ctx.replyWithHTML(message, { ...mainMessageExtra, ...extra });

			return;
		}

		if (promocode.status !== PromocodeStatus.active) {
			const { message, extra } = Messages.promocode.alreadyUsed(promoToken);
			await ctx.replyWithHTML(message, { ...mainMessageExtra, ...extra });

			return;
		}

		await getConnection().transaction(async (transactionalEntityManager) => {
			promocode.status = PromocodeStatus.done;
			promocode.userID = ctx.from!.id;
			await transactionalEntityManager.save(promocode);

			user.balance += promocode.balance;
			await transactionalEntityManager.save(user);
		});

		const { message, extra } = Messages.promocode.successfullyActivated(promocode, user);
		await ctx.replyWithHTML(message, { ...mainMessageExtra, ...extra });
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
		const promocodes: PromoCodeEntity[] = [];

		let promocodeMessage = '';

		for (let i = 0; i < promocodesCount; i++) {
			const promocode = new PromoCodeEntity();
			promocode.adminID = ctx.from!.id;

			promocodeMessage += `<b>${i + 1}.</b> https://t.me/${config.bot.username}?start=${promocode.token}\n`;

			promocodes.push(promocode);
		}

		await PromoCodeEntity.insert(promocodes);

		await ctx.replyWithHTML(promocodeMessage, { disable_web_page_preview: true });
	}
}
