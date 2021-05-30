import { Context } from 'telegraf';

import { config } from './shared/config';
import { TelegramBot } from './shared/core/bot/TelegramBot';
import { MainController, ReportController } from './controllers';
import { MosGorsudService } from './shared/services/MosGorsudService';
import { MessageBuilder } from './shared/core/classes';

export const BOT = new TelegramBot(config.bot.token);

BOT.loadController(MainController);
BOT.loadController(ReportController);

BOT.on('message', async (ctx: Context) => {
	const text = (ctx.message as any).text;

	const data = await MosGorsudService.search(text);

	const message = data.message[0];

	const report = `${message.category.snippetText}\n
	${message.participantsName.snippetText}\n
	${message.publishingStateDescription.snippetText}\n
	${message.firstCourt.snippetText}`;

	await ctx.reply(MessageBuilder.compile(report));
});

BOT.catch(console.error);
