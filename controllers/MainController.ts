import { Context } from 'telegraf';

import { Controller, Command, Hears } from '../shared/core/bot/Controller';
import { Messages } from '../shared/messages';
import { PromoCodeEntity, UserEntity } from '../shared/models';
import { ContextMatch } from '../shared/models/types';
import { config } from '../shared/config';

export class MainController extends Controller {

	@Command('start')
	static async start(ctx: Context) {
		const { text = '', entities = [] } = ctx.message as any;
		
		// 1.
		const user = await UserEntity.getOrCreateFromCTX(ctx);
		const mainMessage = Messages.main.start();

		if (entities[0]?.length === text.length) {
			await ctx.reply(mainMessage.message, mainMessage.extra);

			return;
		}
	
		// 2.
		const promoToken = text.slice(entities[0].length).trim();
		const { message, extra } = await PromoCodeEntity.checkPromoCode(promoToken, user);

		await ctx.reply(message, { ...mainMessage.extra, ...extra });
	}

	@Command('settings')
	static async settings(ctx: Context) {
		const { message, extra } = Messages.main.settings();

		await ctx.reply(message, extra);
	}

	@Hears(/^🆘 Как пользоваться$/iu)
	static async help(ctx: Context) {
		const { message, extra } = Messages.main.help();

		await ctx.reply(message, extra);
	}

	@Hears(/^📍 FAQ$/iu)
	@Command('help')
	static async faq(ctx: Context) {
		const { message, extra } = Messages.main.faq();

		await ctx.reply(message, extra);
	}

	@Hears(/^Сотрудничество$/)
	static async cooperation(ctx: Context) {
		const { message, extra } = Messages.main.cooperation();

		await ctx.reply(message, extra);
	}

	@Command('report')
	static async report(ctx: Context) {
		const { message, extra } = Messages.main.report();

		await ctx.reply(message, extra);
	}

	// ---------------------

	@Hears(/^\/promo (\d+)$/)
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

	@Hears(/^([\w\d]{8})$/)
	static async activatePromocode(ctx: ContextMatch) {
		const [, promoToken] = ctx.match;

		const user = await UserEntity.getOrCreateFromCTX(ctx);

		const { message, extra } = await PromoCodeEntity.checkPromoCode(promoToken, user);
		await ctx.reply(message, extra);
	}
}
