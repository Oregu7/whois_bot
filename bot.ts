import { TelegrafContext } from 'telegraf/typings/context';

import { TelegramBot } from './shared/core/bot/TelegramBot';
import { MainController, ReportController } from './controllers';
import { MosGorsudService } from './shared/services/MosGorsudService';

export const BOT = new TelegramBot('460397887:AAGlqk1TMcUapldnIeD9NmIXZgUTGQmdaLI');

BOT.loadController(MainController);
BOT.loadController(ReportController);

BOT.on('message', async (ctx: TelegrafContext) => {
	const text = ctx.message?.text;

	const data = await MosGorsudService.search(text!);

	const message = data.message[0];

	const report = `${message.category.snippetText}\n
	${message.participantsName.snippetText}\n
	${message.publishingStateDescription.snippetText}\n
	${message.firstCourt.snippetText}`;

	await ctx.reply(Messages.compileMessage(report));
});
