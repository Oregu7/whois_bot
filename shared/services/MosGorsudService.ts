import axios from 'axios';

// -------------------------------------

export interface CourtCase {
	status: string;
	person: string;
	type: string;
	category: string;
	caseNumber: string;
	state: string;
	url: string;
	court: string;
	judge?: string;
	codexArticle?: string;
}

export interface SearchParams {
	q?: string;
	caseNumber?: number;
	uid?: string;
	page?: number;
}

// -------------------------------------
export class MosGorsudService {
	static readonly API_URL: string = 'https://mos-gorsud.ru';

	static async search(options: SearchParams = {}) {
		const url = `${this.API_URL}/search.php`;

		const response = await axios.get(url, {
			params: {
				...options,
				limit: 10,
				offset: (options.page! - 1) * 10,
				formType: 'fullForm',
			},
			headers: {
				'Cache-Control': 'no-cache',
            	'Connection': 'keep-alive',
            	'Upgrade-Insecure-Requests': '1',
            	'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML like Gecko) Chrome/28.0.1500.95 Safari/537.36',
				'Content-Type': 'application/json; charset=UTF-8',
			},
		});

		const list = this.parseData(response.data.message, options.q ?? '');
		const total = Number(response.data.total);

		return { list, pages: Math.ceil(total / 10), total };
	}

	private static parseData(data: Record<string, any>[], searchText: string) {
		const result: CourtCase[] = [];

		for (const rawItem of data) {
			const { status, person } = this.getPersonAndStatus(rawItem.participantsWithCategories, searchText);

			if (person.length === 0) {
				continue;
			}

			const courtCase: CourtCase = {
				status,
				person,
				type: this.getValue(rawItem.type.snippetText),
				category: this.getValue(rawItem.category.snippetText),
				caseNumber: this.getValue(rawItem.fullNumberSearch.snippetText),
				url: `${this.API_URL}${rawItem.url}`,
				state: this.getValue(rawItem.publishingStateDescription.snippetText),
				court: rawItem.court.snippetText,
				judge: rawItem.judge.snippetText ? this.getValue(rawItem.judge.snippetText) : undefined,
				codexArticle: rawItem.codexArticle.snippetText ? this.getValue(rawItem.codexArticle.snippetText) : undefined,
			};

			result.push(courtCase);
		}

		return result;
	}

	private static getValue(message: string, separator = ':'): string {
		const index = message.indexOf(separator);

		if (index === -1) {
			return message;
		}

		let value = message.slice(index + 1).trim();

		value = value.replace('<span class="highlight">', '');
		value = value.replace('</span>', '');

		return value;
	}

	private static getPersonAndStatus(participants: Record<string, string>, searchText: string) {
		let status: string = '', person: string = '';

		for (const key of Object.keys(participants)) {
			if (typeof participants[key] !== 'string') {
				continue;
			}

			if (participants[key].toLowerCase().includes(searchText.toLowerCase()) === true) {
				status = key;
				person = participants[key];

				break;
			}
		}

		return { status, person };
	}

	private constructor() {}
}
