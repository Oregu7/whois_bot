import { Connection, ConnectionOptions, EntityManager, createConnection } from 'typeorm';

import { config } from '../../config';
import { UserEntity, PromoCodeEntity, SearchHistoryEntity } from '../../models';

const ENTITIES = [UserEntity, PromoCodeEntity, SearchHistoryEntity];

export const singletonConfig: ConnectionOptions = {
	type: 'mysql',
	host: config.database.host,
	port: 3306,
	database: config.database.name,
	username: config.database.user,
	password: config.database.password,
	maxQueryExecutionTime: 1000,
	entities: ENTITIES,
	extra: { max: 100 },
	synchronize: true,
};

export class TypeORM{

	static connection?: Connection;
	static masterEntityManager?: EntityManager;

	// ----------------------------

	static async connect(): Promise<void | never>{
		if(this.connection?.isConnected){
			return;
		}

		// Create new connection
		this.connection = await createConnection(singletonConfig);
		this.masterEntityManager = this.connection.createEntityManager(this.connection.createQueryRunner('master'));
	}

	// ----------------------------

	static async stop(): Promise<void | never> {
		if (this.connection === undefined || !this.connection.isConnected) {
			return;
		}

		await this.connection.close();
		this.connection = undefined;
	}

	// ----------------------------

	static async query(sql: string): Promise<any> {
		return this.connection?.query(sql);
	}
}
