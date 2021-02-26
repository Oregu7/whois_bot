import dotenv from 'dotenv';

// ===================================
// Необходимые переменные окружения
// ===================================

dotenv.config();

const REQUIRED_VARIABLES = [
	'NODE_ENV',
	'BOT_TOKEN',
	'DB_NAME',
	'DB_USER',
	'DB_PASS',
];

REQUIRED_VARIABLES.forEach((name) => {
	if (!process.env[name]) {
		throw new Error(`Environment variable ${name} is missing`);
	}
});

// ===================================
// Конфигурация
// ===================================

export const config = {
	env: process.env.NODE_ENV,
	bot: {
		token: process.env.BOT_TOKEN!,
	},
	database: {
		name: process.env.DB_NAME!,
		user: process.env.DB_USER!,
		password: process.env.DB_PASS!,
		host: process.env.DB_HOST || 'localhost',
	},
};
