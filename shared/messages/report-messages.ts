import { Markup } from 'telegraf';

import { MessageBuilder, Message } from '../core/classes';
import { UserEntity } from '../models';


export function balance(user: UserEntity): Message {
	const text = `↔️ У Вас осталось <b>${user?.balance || 0}</b> отчетов`;

	return MessageBuilder.createMessage(text);
}

export function promoCode(): Message {
	const text = `🔸🔹Введите промокод *️⃣*️⃣*️⃣-*️⃣*️⃣*️⃣`;

	return MessageBuilder.createMessage(text);
}

export function buyReports(reportsCount: number): Message {
	const text = `Покупка ${reportsCount} отчетов. Подтвердите оплату в Робокассе`;

	const buttons = [
		[Markup.button.url('Ссылка на робокассу', 'https://robokassa.com')],
	];

	return MessageBuilder.createMessage(text, { inlineKeyboard: buttons });
}
