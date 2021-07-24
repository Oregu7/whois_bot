import { Column, Entity, PrimaryColumn } from 'typeorm';
import { uid } from 'rand-token';

import { PromocodeStatus } from '../types';
import { ModelEntity } from '../_prototype/ModelEntity';

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

	// static async checkPromoCode(token: string) {

	// }
}
