const configurationRouter = require('./api/configuration');
const productRouter = require('./api/products');
const organizationRouter = require('./api/organizations');
const userRouter = require('./api/users');
const dataSetRouter = require('./api/datasets');

const helper = require('../utils/helper');
const consts = require('../configs/consts');
const render = require('../../renderTemplates');
const errorManager = require('../middleware/errorManager');

module.exports = {
	registerRoutes: (app) => {
		const renderTemplates = helper.isRenderTemplatesOn();
		if (renderTemplates) render.renderTemplates(app, true);

		app.use('/', configurationRouter);
		app.use('/', productRouter);
		app.use('/', organizationRouter);
		app.use('/', userRouter);
		app.use('/', dataSetRouter);

		app.get('/', (req, res) => {
			if (renderTemplates) {
				res.render('index',
					{
						title: 'Page not found',
						message: 'IQVIA, Backend',
						products: []
					});
			} else {
				res.send({ data: 'IQVIA Backend' });
			}
		});
	},

	setErrorHandlingRoutes: (app) => {
		app.get('*', (req, res, next) => {
			setImmediate(() => {
				next({ errorType: consts.typeErrors.URL_NOT_DEFINED, message: consts.urlNotDefinedErrorMsg });
			});
		});

		// Mount the unexpected error handler last
		app.use(errorManager.handleUnexpectedError);
	}
};
