import { Markup } from 'telegraf';

import { MessageBuilder, Message } from '../core/classes';
import { UserEntity } from '../models';
import { CourtCase } from '../services/MosGorsudService';
import { Pagination } from '../utils/pagination';


export function balance(user: UserEntity): Message {
	const text = `↔️ У Вас осталось <b>${user?.balance || 0}</b> отчет(ов)`;

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

export function notFound(): Message {
	const text = `🚫 Отсутствует информация по запросу - пожалуйста скорректируйте запрос ✏️\n
	Выбрать действия:`;

	const buttons = [
		[Markup.button.callback('📲 Введите ФИО для поиска', '.')],
		[Markup.button.callback('🖌 Введите номер дела для поиска', '.')],
	];

	return MessageBuilder.createMessage(text, { inlineKeyboard: buttons });
}

export function generateReport(courtCases: CourtCase[], pages: number): Message {
	const text = courtCases.map((courtCase: CourtCase) => {
		const report = `<b>Запрос: ${courtCase.person} - ${courtCase.court}</b>
		<b>Категория дела: ${courtCase.type}</b>
		<b>Статус: ${courtCase.status}</b>
		Номер дела: <a href="${courtCase.url}">${courtCase.caseNumber}</a>
		Текущее состояние: ${courtCase.state}
		Судья: ${courtCase.judge || '---'}
		Статья: ${courtCase.codexArticle || '---'}
		Категория дела: ${courtCase.category || '---'}`;

		return report;
	}).join('\n\n');

	const pagination = new Pagination('report');
	const buttons = pagination.createPagesInlineKeyboard('search', 1, pages);

	return MessageBuilder.createMessage(text, { inlineKeyboard: [buttons] });
}
