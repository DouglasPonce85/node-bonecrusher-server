const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../configs/swagger.json');

module.exports = {
	setSwagger: (app) => {
		app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
	}
};
