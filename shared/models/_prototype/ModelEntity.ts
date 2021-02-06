import { Column, CreateDateColumn, UpdateDateColumn, BaseEntity } from 'typeorm';

// =======================================================

export class ModelEntity extends BaseEntity {
	static $relations: string[] = [];

	// ----------------------------
	// System properties
	// ----------------------------

	$isCreated: boolean = false;
	$isChanged: boolean = false;
	
	// ----------------------------
	// Base stored fields
	// ----------------------------
	
	@Column() @CreateDateColumn()
	readonly createDT: Date = new Date();
	
	@Column() @UpdateDateColumn()
	readonly updateDT: Date = new Date();
	
	// ----------------------------
	// Static helpers
	// ----------------------------

	// ----------------------------
	// Constructor
	// ----------------------------

	constructor() {
		super();
	}
	
	// ----------------------------
	// Instance Methods
	// ----------------------------

	deleteFields(dto: Record<string, any>, fields: (keyof this)[]) {
		const Self = this.constructor as any;
		return Self.deleteFields(dto, fields);
	}

	// ---------------------------------------------

	deleteAllFieldsExcept(dto: Record<string, any>, fields: (keyof this)[]) {
		const Self = this.constructor as any;
		return Self.deleteAllFieldsExcept(dto, fields);
	}
}
