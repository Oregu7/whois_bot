import { Context } from 'telegraf';

import { Controller, Command, Pattern } from '../shared/core/bot/Controller';
import { Messages } from '../shared/messages';
import { PromocodeEntity, UserEntity } from '../shared/models';
import { ContextMatch } from '../shared/models/types';

export class MainController extends Controller {

	@Command('start')
	static async start(ctx: Context) {
		const { message, extra } = Messages.main.start();
		
		await UserEntity.createFromCTX(ctx);
	
		await ctx.reply(message, extra);
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

		await PromocodeEntity.create(promocodes);

		await ctx.reply(promocodeMessage);
	}
}
