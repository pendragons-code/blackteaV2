global.logError = function logError(error, details) {
	console.log("============================== New Error ==============================");
	console.error("============================== New Error ==============================");
	console.log(error.stack);
	if(details) {
		console.log(`[${currentDateTime()}] ${details}`);
		console.error(`[${currentDateTime()}] ${details}`); // e.g socket error or express server error
	}
	console.log(`[${currentDateTime()}] ${error}`);
	console.error(`[${currentDateTime()}] ${error}`);
	console.log("============================== End Error ==============================");
	console.log(error);
	console.error("============================== End Error ==============================");
}