import { Context } from 'telegraf';

export enum UserType {
	user = 0,
	moderator = 10,
	administrator = 100,
}

// ----------------------------

export enum UserStatus {
	active = 100,
	banned = -100,
}

// ----------------------------

export enum Lang {
	ru = 'ru',
	en = 'en',
}

// ----------------------------

export enum PromocodeStatus {
	rejected = -100,
	draft = 0,
	active = 10,
	done = 100,
}

// ----------------------------

export type ContextMatch = Context & { match: RegExpExecArray };
