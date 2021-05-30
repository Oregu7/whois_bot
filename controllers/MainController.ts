import { Context } from 'telegraf';

import { Controller, Command, Pattern } from '../shared/core/bot/Controller';
import { Messages } from '../shared/messages';
import { UserEntity } from '../shared/models';

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
}
