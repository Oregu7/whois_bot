import { TypeORM } from './TypeORM';

export { TypeORM } from './TypeORM';

export class DataSource {

	static async connect(): Promise<void | never> {
		await TypeORM.connect();
	}

	static async stop(): Promise<void | never> {
		await TypeORM.stop();
	}
}
