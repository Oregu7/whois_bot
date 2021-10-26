import { Context } from 'telegraf';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { ModelEntity } from '../_prototype/ModelEntity';


@Entity('search_histories')
export class SearchHistoryEntity extends ModelEntity {
    
	@PrimaryGeneratedColumn()
	id!: number;

	@Column('integer')
	userID!: number;

	@Column('varchar')
	searchText!: string;

	@Column('integer')
	totalCount!: number;

	// ============================
	// STATIC METHODS
	// ============================

	static async createSearchHistory(ctx: Context, searchText: string, totalCount: number) {
		const searchHistory = this.create({
			userID: ctx.from?.id,
			searchText,
			totalCount,
		});

		await searchHistory.save();

		return searchHistory;
	}
}
