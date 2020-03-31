module.exports = {
	defaultServerPort: 3000,
	testServerPort: 7000,
	defaultThreadPoolSize: 4,
	urlNotDefinedStatus: 404,
	codeErrorStatus: 400,
	successStatus: 200,

	customId: 'ID',
	devEnvironment: 'DEVELOP',
	testEnvironment: 'TEST',
	pathBootstrap: '/node_modules/bootstrap/dist/',
	pathJQuery: '/node_modules/jquery/dist',
	urlNotDefinedErrorInfo: 'URL is not defined',
	urlNotDefinedErrorMsg: 'Sorry, we cannot load this page right now and apologise for the inconvenience.',
	controllerRaisedError: 'Unknown code error raised at controller file',

	dbTables: {
		PRODUCTS: 'PRODUCTS',
		ORGANIZATIONS: 'ORGANIZATIONS',
		USERS: 'USERS',
		DATASETS: 'DATASETS',
		USERPRODUCTS: 'USERPRODUCTS'
	},

	typeErrors: {
		URL_NOT_DEFINED: 'URL_NOT_DEFINED',
		CONTROLLER_RAISED: 'CONTROLLER_RAISED'
	},

	deleteRowStates: {
		NO_RECORD_FOUND: 'NO_RECORD_FOUND',
		INVALID_DATA: 'INVALID_DATA',
		DELETED: 'DELETED'
	}
};
