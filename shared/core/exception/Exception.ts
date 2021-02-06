export enum ExceptionType {
	TimeResync = 'TimeResync',
	BadRequest = 'BadRequest',
	Validation = 'Validation',
	Authorize = 'Authorize',
	AccessNotAllowed = 'AccessNotAllowed',
	NotFound = 'NotFound',
	Core = 'Core',
	Service = 'Service',
	DataSource = 'DataSource',
}

// -------------

export class Exception extends Error {
	type: string;
	params?: Record<string, any>;
	alert: boolean = true;
	showParamsInResponse: boolean = false;
	constructor(type: ExceptionType, message: string, params?: Record<string, any>, options?: { alert?: boolean; showParamsInResponse?: boolean });
	constructor(type: ExceptionType, error: Error, params?: Record<string, any>, options?: { alert?: boolean; showParamsInResponse?: boolean });

	// -------------

	constructor(
		type: ExceptionType,
		messageOrError: string | Error,
		params?: Record<string, any>,
		options?: { alert?: boolean; showParamsInResponse?: boolean }) {
		super();

		if (typeof messageOrError === 'string') {
			this.message = messageOrError;
		} else {
			this.message = messageOrError.message;
			this.stack = messageOrError.stack;
			this.name = messageOrError.name;
		}

		this.name = this.constructor.name;
		this.type = type;
		this.params = params;
		this.alert = options?.alert ?? this.alert;
		this.showParamsInResponse = options?.showParamsInResponse ?? this.showParamsInResponse;
		/**
		 * @see https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
		 */
		Object.setPrototypeOf(this, Exception.prototype);
	}

	// -------------

	get httpCode(): number {
		switch (this.type) {
			case ExceptionType.Validation:
			case ExceptionType.BadRequest:
				return 400;

			case ExceptionType.Authorize:
				return 401;

			case ExceptionType.AccessNotAllowed:
				return 403;

			case ExceptionType.NotFound:
				return 404;

			case ExceptionType.TimeResync:
				return 406;
	
			default:
				return 500;
		}
	}
}
