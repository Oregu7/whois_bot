export class Action {
	protected name: string;

	constructor(name: string) {
		this.name = name;
	}

	cb(...args: any[]) {
		if (args.length === 0) {
			return this.name;
		}
        
		return `${this.name}:${args.join(';')}`;
	}

	rg(...args: any[]) {
		if (args.length === 0) {
			return this.name;
		}

		const patterns = args
			.map((pattern) => `(${pattern})`)
			.join(';');

		return new RegExp(`^${this.name}:${patterns}$`);
	}
}
