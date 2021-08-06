import { Context } from 'telegraf';
import { UpdateType, MessageSubType } from 'telegraf/src/telegram-types';

import { Action } from '../classes';


export enum HandlerType {
	command = 'command',
	on = 'on',
	hears = 'hears',
	action = 'action',
}

export interface Handler {
	pattern: any;
	type: HandlerType;
	callback: (ctx: Context) => any;
}

export abstract class Controller {
	static readonly $handlers: Handler[] = [];
}

// =======================================================
// Decorators
// =======================================================

// TODO: добавить декоратор Use - навешивает Middleware

export const Command = function(commandName: string) {
	return function(target: any, propertyKey: string) {
		const handler: Handler = {
			pattern: commandName,
			type: HandlerType.command,
			callback: target[propertyKey].bind(target),
		};

		target.$handlers.push(handler);
	};
};

export const Hears = function(pattern: string | string[] | RegExp | RegExp[]) {
	return function(target: any, propertyKey: string) {
		const handler: Handler = {
			pattern,
			type: HandlerType.hears,
			callback: target[propertyKey].bind(target),
		};

		target.$handlers.push(handler);
	};
};

export const OnUpdate = function(updateType: UpdateType | MessageSubType) {
	return function(target: any, propertyKey: string) {
		const handler: Handler = {
			pattern: updateType,
			type: HandlerType.on,
			callback: target[propertyKey].bind(target),
		};

		target.$handlers.push(handler);
	};
};

export const CbAction = function(action: Action, ...params: string[]) {
	return function(target: any, propertyKey: string) {
		const handler: Handler = {
			pattern: action.rg(...params),
			type: HandlerType.action,
			callback: target[propertyKey].bind(target),
		};

		target.$handlers.push(handler);
	};
};
