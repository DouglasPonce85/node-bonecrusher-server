const { typeErrors } = require('../configs/consts');
const errorHandler = require('../handlers/errorHandler');

module.exports = {
	handleUnexpectedError: (err, req, res, next) => {
		if (res.headersSent) return next(err);

		const { errorType } = err;
		switch (errorType) {
		case typeErrors.URL_NOT_DEFINED:
			errorHandler.urlNotDefinedHandler(err, res);
			break;
		case typeErrors.CONTROLLER_RAISED:
			errorHandler.controllerRaised(err, res);
			break;
		default:
			errorHandler.unexpectedErrorRaised(err, res);
			break;
		}

		return 0;
	}
};
