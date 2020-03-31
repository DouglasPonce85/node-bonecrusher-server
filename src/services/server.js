const debug = require('debug')('app');
const chalk = require('chalk');

const myRouter = require('../routes/router');

let httpServer;
module.exports = {
	runServer: (app, serverPort) => {
		myRouter.setErrorHandlingRoutes(app);

		return new Promise((resolve, reject) => {
			httpServer = app.listen(serverPort, (err) => {
				if (err) {
					console.log('... Server raised error ', err);
					reject(err);
					return;
				}

				debug(`... Listening @ Port ${chalk.green(serverPort)}`);
				resolve(httpServer);
			});
		});
	},

	closeServer: () => new Promise((resolve, reject) => {
		console.log('... Entered closing server');

		if (!httpServer) return;

		httpServer.close((err) => {
			if (err) {
				console.log('... Error @ closeServer() ');
				reject(err);
				return;
			}

			resolve();
		});
	})
};
