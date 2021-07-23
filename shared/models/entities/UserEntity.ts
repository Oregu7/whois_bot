import { Context } from 'telegraf';
import { Column, Entity, PrimaryColumn } from 'typeorm';

import { Lang, UserStatus, UserType } from '../types';
import { ModelEntity } from '../_prototype/ModelEntity';

@Entity('users')
export class UserEntity extends ModelEntity {
    
	@PrimaryColumn()
	id!: number;

	@Column('smallint')
	type: UserType = UserType.user;

	@Column('smallint')
	status: UserStatus = UserStatus.active;

	@Column('varchar', { length: 200 })
	firstName: string = '';

	@Column('varchar', { length: 200 })
	lastName: string = '';

	@Column('varchar', { length: 200 })
	username: string = '';

	@Column('varchar', { length: 5 })
	lang: Lang = Lang.ru;

	@Column('integer')
	balance: number = 0;

	// ============================
	// STATIC METHODS
	// ============================

	static async getOrCreateFromCTX(ctx: Context) {
		const userDB = await this.findOne(ctx.from?.id);

		if (userDB !== undefined) {
			return userDB;
		}

		const user = this.create({
			id: ctx.from?.id,
			firstName: ctx.from?.first_name,
			lastName: ctx.from?.last_name,
			username: ctx.from?.username,
		});

		await user.save();

		return user;
	}
}
