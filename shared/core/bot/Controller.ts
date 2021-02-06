export class Controller {
	static readonly $commands: any[] = [];
	static readonly $patterns: any[] = [];
}

// =======================================================
// Decorators
// =======================================================

export const Command = function(commandName: string) {
	return function(target: any, propertyKey: string) {
		target.$commands.push([commandName, target[propertyKey]]);
	};
};

export const Pattern = function(pattern: string | string[] | RegExp | RegExp[]) {
	return function(target: any, propertyKey: string) {
		target.$patterns.push([pattern, target[propertyKey]]);
	};
};
