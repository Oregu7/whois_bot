import { DataSource } from '../shared/core/ds';
import { BOT } from '../bot';

if (require.main === module) {
	(async () => {
		await DataSource.connect();

		await BOT.telegram.deleteWebhook();
		
		BOT.startPolling();
	})();
}
