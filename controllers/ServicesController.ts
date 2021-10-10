import { Context } from 'telegraf';

import { Controller, Hears, OnUpdate } from '../shared/core/bot/Controller';
import { Messages } from '../shared/messages';

export class ServicesController extends Controller {

	@Hears(/^💥 Помощь с пробивом$/iu)
	static async breakoutHelp(ctx: Context) {
		const { message, extra } = Messages.services.breakoutHelp();

		await ctx.reply(message, extra);
	}

	@OnUpdate('message')
	static async breakoutHelpCommand(ctx: Context, next: () => any) {
		const text = ((ctx.message as any).text ?? '').trim();

		let replyMessage = '';

		switch (text) {
			case 'Кpедитный pейтинг 1500₽ эл.док':
			case 'Пpовеpкa на Бaнкротствo - 1500₽ эл.док':
				replyMessage = '👉Пришлите № ИНН физ. лица и дату выдачи,его ФИО, регион ℹ️';
				break;
			
			case 'Пpoверка ГИБДД - 3000₽ эл.док':
				replyMessage = '👉Пришлите ФИО, № и дату выдачи ВУ, регион выдачи и № отделения ℹ️';
				break;

			case 'Фopмa 1 прoвеpкa пaспортa PФ на действительность - 3500₽ эл.док':
				replyMessage = '👉Пришлите ФИО, № и серию, дату выдачи, кем выдан, код подразделения ℹ️';
				break;

			case 'Наличие coбствeннocти - Налоговая':
			case 'Наличие coбствeннocти - Росреестр':
				replyMessage = '👉Пришлите ФИО и ИНН - физ. лица  👉 ИНН и название - юр. лица ℹ️';
				break;

			case 'Кому принадлежит номер телефона':
				replyMessage = '👉Пришлите № телефона ℹ️';
				break;

			case 'Информация по расчетным счетам (ЮЛ) (все операции) - от 50 000₽ эл.док':
				replyMessage = '👉Пришлите ИНН и название - юр. лица ℹ️';
				break;

			default:
				return next();
		}

		const { message, extra } = Messages.services.breakoutHelpMessage(replyMessage);
		await ctx.reply(message, extra);
	}

	@Hears(/^🔙 Назад$/iu)
	static async backToMain(ctx: Context) {
		const { message, extra } = Messages.main.start();
		await ctx.reply(message, extra);
	}
}
