const myServer = require('../services/server');
const database = require('../services/database');

async function shutDown(error) {
	let err = error;

	console.log('... Shutting down server');
	try {
		console.log('... Closing web server module');
		await myServer.closeServer();

		console.log('... Closing database module');
		await database.closeDB();
	} catch (e) {
		console.log('... Encountered error', e);
		err = err || e;
	}

	console.log('... Exiting process');
	if (err) {
		process.exit(1); // Non-zero failure code
	} else {
		process.exit(0);
	}
}

async function runProcessListeners(app) {
	process.on('SIGTERM', async () => {
		console.log('... Received SIGTERM');
		await shutDown(app);
	});

	process.on('SIGINT', async () => {
		console.log('... Received SIGINT');
		await shutDown(app);
	});

	process.on('uncaughtException', async (err) => {
		console.log('... Uncaught exception !!');
		console.error(err);
		await shutDown(app, err);
	});
}

module.exports = {
	shutDown,
	runProcessListeners
};
