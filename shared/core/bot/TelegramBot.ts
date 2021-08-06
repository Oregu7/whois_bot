import { Telegraf } from 'telegraf';

import { Controller } from './Controller';

export class TelegramBot extends Telegraf {

	loadController(controller: typeof Controller) {
		for (const handler of controller.$handlers) {
			this[handler.type](handler.pattern, handler.callback);
		}
	}
}
