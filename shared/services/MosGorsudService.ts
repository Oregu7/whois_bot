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
}

// -------------------------------------
export class MosGorsudService {
	static readonly API_URL: string = 'https://mos-gorsud.ru';

	static async search(options: SearchParams = {}) {
		const url = `${this.API_URL}/search.php`;

		const response = await axios.get(url, {
			params: {
				...options,
				formType: 'fullForm',
				offset: 0,
				limit: 15,
			},
		});

		return this.parseData(response.data.message, options.q ?? '');
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
