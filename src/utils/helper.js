const dbConfig = require('../configs/global/db_config.js');
const consts = require('../configs/consts');

function isRenderTemplatesOn() {
	return parseInt(process.env.RENDER_TEMPLATES, 10) === 1;
}

function useMockData() {
	return parseInt(process.env.USE_MOCK_DATA, 10) === 1;
}

function getDbConfig() {
	return process.env.NODE_ENV === consts.devEnvironment ? dbConfig.development : dbConfig.production;
}

function isDevelopEnvironment() {
	return process.env.NODE_ENV === consts.devEnvironment;
}

function isTestEnvironment() {
	return process.env.NODE_ENV === consts.testEnvironment;
}

function getUrlNotDefinedStatus() {
	return process.env.URL_NOT_DEFINED_STATUS || consts.urlNotDefinedStatus;
}

function getCodeErrorStatus() {
	return process.env.CODE_ERROR_STATUS || consts.codeErrorStatus;
}

function getDefaultPort() {
	const serverPort = process.env.PORT || consts.defaultServerPort;
	return serverPort;
}

function getServerConfigPort() {
	return isDevelopEnvironment() ? consts.testServerPort : getDefaultPort();
}

function printConsoleRunMode() {
	const port = getServerConfigPort();
	console.log('---------------------------');

	if (isDevelopEnvironment()) {
		console.log(` Running @ PORT ${port}`);
		console.log(' Running [ DEVELOP-MODE ] ');
	} else {
		console.log(` Running @ PORT ${port}`);
		console.log(' Running [ PRODUCTION-MODE ] ');
	}

	console.log('---------------------------');
}

function getErrorStackInfo(err) {
	const stack = err.stack || '';
	return stack.split('\n').map(line => line.trim());
}

function controllerErrorRaised(methodName, err, next) {
	const source = `Error @ method [ ${methodName}() ]`;
	const stackInfo = getErrorStackInfo(err);
	console.log(source, stackInfo);

	next({
		message: err,
		errorType: consts.typeErrors.CONTROLLER_RAISED,
		source,
		stackInfo
	});
}

function rowNotUpdatedValidation(model, req, res) {
	const { id } = req.params;
	const { tableName } = model;

	const message = `Could not update from the specified table [${tableName}]. No record found for ID [${id}].`;
	res.send(message, consts.codeErrorStatus);
}

module.exports = {
	isRenderTemplatesOn,
	useMockData,
	getDbConfig,
	getUrlNotDefinedStatus,
	getCodeErrorStatus,
	isDevelopEnvironment,
	isTestEnvironment,
	getDefaultPort,
	getServerConfigPort,
	printConsoleRunMode,
	getErrorStackInfo,
	controllerErrorRaised,
	rowNotUpdatedValidation
};
