import { MessageBuilder, Message } from '../core/classes';
import { PromoCodeEntity, UserEntity } from '../models';

export function notFound(promoToken: string): Message {
	const text = `Промокод: <b>${promoToken}</b> не найден!`;

	return MessageBuilder.createMessage(text);
}

export function alreadyUsed(promoToken: string): Message {
	const text = `Промокод: <b>${promoToken}</b> уже активирован!`;

	return MessageBuilder.createMessage(text);
}

export function successfullyActivated(promoCode: PromoCodeEntity, user: UserEntity): Message {
	const text = `Вы успешно активировали Промокод на: <b>${promoCode.balance}</b> отчет(ов).\n
	Ваш текщий баланс: <b>${user.balance}</b>`;

	return MessageBuilder.createMessage(text);
}
