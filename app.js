const express = require('express');

const helper = require('./src/utils/helper');
const control = require('./src/utils/control');

const myMiddleware = require('./src/middleware/appMiddleware');
const myRouter = require('./src/routes/router');
const mySwagger = require('./src/services/swagger');
const myServer = require('./src/services/server');

const app = express();

// eslint-disable-next-line consistent-return
async function startup(serverPort) {
	await control.runProcessListeners();

	try {
		// Setting for routing api documentation services
		mySwagger.setSwagger(app);

		// Setting app level middleware configuration
		myMiddleware.loadMiddleware(app);

		// Setting for routing for general api calls
		await myRouter.registerRoutes(app);

		console.log('>> Initializing server');
		const server = await myServer.runServer(app, serverPort);

		console.log(`>> MockData [ ${helper.useMockData()} ]`);
		console.log(`>> Templates [ ${helper.isRenderTemplatesOn()} ]`);
		console.log('----------------------- ');
		return server;
	} catch (err) {
		console.log('... Encountered error', err);
		// Non-zero failure code
		process.exit(1);
	}
}

if (!helper.isTestEnvironment()) {
	helper.printConsoleRunMode();
	startup(helper.getServerConfigPort());
}

module.exports = {
	startup
};
