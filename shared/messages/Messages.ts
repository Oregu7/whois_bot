import { Markup, Extra } from 'telegraf';
import { InlineKeyboardMarkup } from 'telegraf/typings/telegram-types';

import main from './templates/main.json';

// =================================

export enum MessageType {
	HTML = 'HTML',
	Markdown = 'Markdown'
}

// =================================

export class Messages {
	static readonly main = main;

	static compileMessage(messageText: string): string {
		const lines = messageText.split('\n').map((line) => line.trim());

		return lines.join('\n');
	}

	static createExtra(keyboard: Markup & InlineKeyboardMarkup, type = MessageType.HTML, webPreview = false) {
		const extra = Extra
			.webPreview(webPreview)
			.markup(keyboard);

		if (type === MessageType.HTML) {
			extra.HTML();
		} else {
			extra.markdown();
		}
			
		return extra;
	}

	static createMessage(messageText: string, buttons = [], type: MessageType = MessageType.HTML) {
		const message = this.compileMessage(messageText);
		const keyboard = Markup.inlineKeyboard(buttons);
		const extra = this.createExtra(keyboard, type);

		return {
			message,
			keyboard,
			extra,
		};
	}
}
