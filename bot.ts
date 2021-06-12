import { Context } from 'telegraf';

import { config } from './shared/config';
import { TelegramBot } from './shared/core/bot/TelegramBot';
import { MainController, ReportController } from './controllers';
import { CourtCase, MosGorsudService } from './shared/services/MosGorsudService';
import { MessageBuilder } from './shared/core/classes';

export const BOT = new TelegramBot(config.bot.token);

BOT.loadController(MainController);
BOT.loadController(ReportController);

BOT.on('message', async (ctx: Context) => {
	const text = (ctx.message as any).text;

	const data = await MosGorsudService.search(text);

	const reportMessage = data.slice(0, 5).map((courtCase: CourtCase) => {
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

	await ctx.replyWithHTML(MessageBuilder.compile(reportMessage));
});

BOT.catch(console.error);
