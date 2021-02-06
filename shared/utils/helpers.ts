export function asyncSleep(ms: number): Promise<boolean> {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}
