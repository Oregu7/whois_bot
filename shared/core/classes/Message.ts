import { Markup } from 'telegraf';
import {
	ForceReply,
	InlineKeyboardButton,
	InlineKeyboardMarkup,
	KeyboardButton,
	ParseMode,
	ReplyKeyboardMarkup,
	ReplyKeyboardRemove,
} from 'telegraf/typings/core/types/typegram';


type Hideable<B> = B & { hide?: boolean };
type HideableKBtn = Hideable<KeyboardButton>;
type HideableIKBtn = Hideable<InlineKeyboardButton>;

interface MessageBuilderOptions {
	parseMode?: ParseMode;
	keyboard?: HideableKBtn[][];
	inlineKeyboard?: HideableIKBtn[][];

	removeKeyboard?: boolean;
	webPreview?: boolean;
}

interface MessageExtra {
	parse_mode: ParseMode;
	disable_web_page_preview?: boolean;
	reply_markup?: InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove | ForceReply;
}

export interface Message {
	message: string;
	extra: MessageExtra;
}

// ================================

export class MessageBuilder {

	static compile(text: string) {
		return text.split('\n').map((row) => row.trim()).join('\n');
	}

	static createMessage(text: string, options: MessageBuilderOptions = {}): Message {
		const { parseMode = 'HTML', keyboard, inlineKeyboard, removeKeyboard, webPreview } = options;

		const message = this.compile(text);

		const extra: MessageExtra = {
			parse_mode: parseMode,
			disable_web_page_preview: Boolean(webPreview),
		};

		// 1. set reply markup
		if (keyboard !== undefined) {
			extra.reply_markup = Markup.keyboard(keyboard).resize(true).reply_markup;
		} else if (inlineKeyboard !== undefined) {
			extra.reply_markup = Markup.inlineKeyboard(inlineKeyboard).reply_markup;
		} else if (removeKeyboard !== undefined) {
			extra.reply_markup = Markup.removeKeyboard().reply_markup;
		}

		return { message, extra };
	}
}
