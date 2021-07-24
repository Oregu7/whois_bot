import { Column, Entity, getConnection, PrimaryColumn } from 'typeorm';
import { uid } from 'rand-token';

import { PromocodeStatus } from '../types';
import { ModelEntity } from '../_prototype/ModelEntity';
import { Messages } from '../../messages';
import { UserEntity } from './UserEntity';

@Entity('promocodes')
export class PromoCodeEntity extends ModelEntity {
    
	@PrimaryColumn()
	token: string = uid(8);

	@Column('smallint')
	status: PromocodeStatus = PromocodeStatus.active;

	@Column('integer', { nullable: true })
	userID: number | null = null;

	@Column('integer')
	adminID!: number;

	@Column('integer')
	balance: number = 1;

	// ============================
	// STATIC METHODS
	// ============================

	static async checkPromoCode(token: string, user: UserEntity) {
		const promocode = await PromoCodeEntity.findOne({ token });

		if (promocode === undefined) {
			return Messages.promocode.notFound(token);
		}

		if (promocode.status !== PromocodeStatus.active) {
			return Messages.promocode.alreadyUsed(token);
		}

		await getConnection().transaction(async (transactionalEntityManager) => {
			promocode.status = PromocodeStatus.done;
			promocode.userID = user.id;
			await transactionalEntityManager.save(promocode);

			user.balance += promocode.balance;
			await transactionalEntityManager.save(user);
		});

		return Messages.promocode.successfullyActivated(promocode, user);
	}
}
