import { TelegramBot } from './shared/core/bot/TelegramBot';
import { MainController } from './controllers';

export const BOT = new TelegramBot('460397887:AAGlqk1TMcUapldnIeD9NmIXZgUTGQmdaLI');

BOT.loadController(MainController);
