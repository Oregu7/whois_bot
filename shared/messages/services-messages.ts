import { Markup } from 'telegraf';

import { MessageBuilder, Message } from '../core/classes';

export function breakoutHelp(): Message {
	const text = `💥 Помощь с пробивом`;

	const keyboard = [
		[Markup.button.text('Кpедитный pейтинг 1500₽ эл.док')],
		[Markup.button.text('Пpовеpкa на Бaнкротствo - 1500₽ эл.док')],
		
		[Markup.button.text('Пpoверка ГИБДД - 3000₽ эл.док')],
		[Markup.button.text('Фopмa 1 прoвеpкa пaспортa PФ на действительность - 3500₽ эл.док')],
		
		[Markup.button.text('Наличие coбствeннocти - Налоговая')],
		[Markup.button.text('Наличие coбствeннocти - Росреестр')],
		
		[Markup.button.text('Кому принадлежит номер телефона')],
		[Markup.button.text('Информация по расчетным счетам (ЮЛ) (все операции) - от 50 000₽ эл.док')],

		[Markup.button.text('🔙 Назад')],
	];

	return MessageBuilder.createMessage(text, { keyboard });
}

export function breakoutHelpMessage(messageText: string) {
	const text = messageText;
	const url = 'https://t.me/ruhelper';

	const keyboard = [
		[Markup.button.url('@ruhelper', url)],
	];

	return MessageBuilder.createMessage(text, { inlineKeyboard: keyboard });
}
