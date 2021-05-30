import { Markup } from 'telegraf';

import { MessageBuilder, Message } from '../core/classes';


export function start(): Message {
	const text = `<b>Участие в:</b> ✔️Уголовных ✔️Гражданских ✔️Административных и иных процессах 
	🔺наличие долгов
			
	👤<b>Поиск по имени:</b>
		├Иванов Валерий Николаевич
		├Иванов ВН, 
		├Иванов В.Н.
		└Иванов В.Н.
	
	🆘Если у Вас остались вопросы - напишите боту "/help"`;

	const keyboard = [
		[
			Markup.button.text('50 р - 1 отчет'),
			Markup.button.text('500 р - 12 отчетов'),
			Markup.button.text('1000 р - 30 отчетов'),
		],
		[
			Markup.button.text('Остаток запросов'),
			Markup.button.text('Как пользоваться'),
			Markup.button.text('Промокод'),
		],
	];

	return MessageBuilder.createMessage(text, { keyboard });
}

export function settings(): Message {
	const text = `Информация и статистика о клиенте:\n
	- количество оставшихся отчетов;
	- количество сформированных отчетово
	- возможность купить отчеты`;

	return MessageBuilder.createMessage(text);
}

export function help(): Message {
	const text = `Информация о проекте, видеогайды и инструкции`;

	return MessageBuilder.createMessage(text);
}

export function report(): Message {
	const text = `Сообщение что умеет бот и как пользоваться ботом (Формат запроса)
	
	<b>- Пример запроса:</b>
	
	Иванов Иван Иванович (Иванов ИИ, Иванов Иван И, Иванов И Иванович, Иванов), Москва, Тверская, 17 (Указывается регион, город, улица, район по месту регистрации лица) Если нет информации – ищет все сходства по всей России. `;

	return MessageBuilder.createMessage(text);
}
