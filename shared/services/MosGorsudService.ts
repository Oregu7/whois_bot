import axios from 'axios';

export class MosGorsudService {
	static readonly API_URL: string = 'https://mos-gorsud.ru';

	static async search(text: string) {
		const url = `${this.API_URL}/search.php`;

		const response = await axios.get(url, {
			params: {
				q: text,
				offset: 0,
				limit: 15,
			},
		});

		return response.data;
	}
}
