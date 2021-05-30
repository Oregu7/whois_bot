import { Telegraf } from 'telegraf';
import { Context } from 'telegraf/typings/context';

import { Controller } from './Controller';

export class TelegramBot extends Telegraf<Context> {

	loadController(controller: typeof Controller) {
		// 1. load commands
		for (const command of controller.$commands) {
			this.command(command[0], command[1]);
		}

		// 2. load patterns
		for (const pattern of controller.$patterns) {
			this.hears(pattern[0], pattern[1]);
		}
	}
}
