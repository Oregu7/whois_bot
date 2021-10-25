import { Markup } from 'telegraf';
import { InlineKeyboardButton } from 'telegraf/typings/core/types/typegram';


export class Pagination {
	
	constructor(private action: string) {}

	private createPageInlineButton(token: string, index: number, text: string) {
		return Markup.button.callback(text, `${this.action}:${index};${token}`);
	}

	private generatePagesInlineKeyboard(token: string, start: number, last: number, pageIndx: number, firstArrow = false, lastArrow = false) {
		const pagesInlineKeyboard = [];
		for (let i = start; i <= last; i++) {
			const text = i === pageIndx ? `\u{00B7} ${i} \u{00B7}` : (firstArrow && i === start) ? `\u{2039} ${i}` :
				(lastArrow && i === last) ? `${i} \u{203A}` : String(i);
			const pageInlineButton = this.createPageInlineButton(token, i, text);
			pagesInlineKeyboard.push(pageInlineButton);
		}

		return pagesInlineKeyboard;
	}

	createPagesInlineKeyboard(token: string, currentPage: number, countPages: number) {
		const factor = 4;

		// приводим к типу Number
		currentPage = Number(currentPage);

		let pagesInlineKeyboard: InlineKeyboardButton.CallbackButton[] = [];

		if (countPages > 1) {
			const startButton = this.createPageInlineButton(token, 1, '\u{00AB} 1');
			const lastButton = this.createPageInlineButton(token, countPages, `${countPages} \u{00BB}`);

			if (countPages > factor) {
				if ((countPages - currentPage) <= factor - 2) {
					pagesInlineKeyboard = [
						startButton,
						...this.generatePagesInlineKeyboard(
							token,
							countPages - (factor - 1),
							countPages,
							currentPage,
							true,
							false
						),
					];
				} else if (currentPage > factor - 1) {
					const prevPage = Number(currentPage) - 1;
					const nextPage = Number(currentPage) + 1;
					pagesInlineKeyboard = [
						startButton,
						...this.generatePagesInlineKeyboard(
							token,
							prevPage,
							nextPage,
							currentPage,
							true,
							true
						),
						lastButton,
					];
				} else {
					pagesInlineKeyboard = [
						...this.generatePagesInlineKeyboard(
							token,
							1,
							factor,
							currentPage,
							false,
							true
						),
						lastButton,
					];
				}
			} else {
				pagesInlineKeyboard = this.generatePagesInlineKeyboard(token, 1, countPages, currentPage);
			}
		}

		return pagesInlineKeyboard;
	}
}
