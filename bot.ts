import { config } from './shared/config';
import { TelegramBot } from './shared/core/bot/TelegramBot';
import { MainController, ReportController } from './controllers';

export const BOT = new TelegramBot(config.bot.token);

BOT.loadController(MainController);
BOT.loadController(ReportController);

BOT.catch(console.error);
