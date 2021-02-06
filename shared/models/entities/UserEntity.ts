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

	@Column('numeric')
	balance: number = 0;
}
