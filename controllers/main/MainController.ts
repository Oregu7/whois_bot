import { Context, Extra, Markup } from 'telegraf';

import { Controller, Command, Pattern } from '../../shared/core/bot/Controller';
import { Messages } from '../../shared/messages/';

export class MainController extends Controller {

	@Command('start')
	static async start(ctx: Context) {
		const message = `Бот помогает найти информацию о людях.
		Участие их в уголовных, гражданских, административных и иных процессах,
		наличие долгов и характеристик на них.
		- Пример запроса
		Иванов Иван Иванович (Иванов ИИ, Иванов Иван И,
		Иванов И Иванович, Иванов), Москва, Тверская,
		17, 10.12.1988 года рождения (Указывается регион,
		город, улица, район по месту регистрации лица)
		Если нет информации – ищет все сходства по всей России.
		Если у Вас остались вопросы - напишите боту "/help"`;

		const keyboard = Markup.keyboard([
			[
				Markup.button('50 р - 1 отчет'),
				Markup.button('500 р - 12 отчетов'),
				Markup.button('1000 р - 30 отчетов'),
			],
			[
				Markup.button('Остаток запросов'),
				Markup.button('Как пользоваться'),
				Markup.button('Промокод'),
			],
		]);
	
		await ctx.replyWithHTML(message, Extra.markup(keyboard.resize(true)));
	}

	@Command('settings')
	static async settings(ctx: Context) {
		await ctx.replyWithHTML(Messages.main.settings.text);
	}

	@Pattern('Как пользоваться')
	@Command('about')
	static async about(ctx: Context) {
		await ctx.replyWithHTML(Messages.main.about.text);
	}

	@Command('report')
	static async report(ctx: Context) {
		await ctx.replyWithHTML(Messages.main.report.text);
	}
}

