const morgan = require('morgan');
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

const reviver = require('../utils/reviver');
const cors = require('../middleware/cors');

module.exports = {
	loadMiddleware: (app) => {
		// Combines logging info from request and response [combined | tiny]
		app.use(morgan('tiny'));

		app.use(bodyParser.urlencoded({
			extended: true
		}));

		// Will parse incoming JSON requests and revive ISO 8601 date strings
		// to instances of Date
		app.use(bodyParser.json({
			reviver: reviver.reviveDates
		}));

		//Parses Cookie header and populate req.cookies with an object keyed by the cookie names
		app.use(cookieParser());

		// Lets you use HTTP verbs such as PUT or DELETE in places where the client doesn’t support it.
		app.use(methodOverride());

		// Enable CORS since we want to allow the API to be consumed by domains
		// other than the one the API is hosted from.
		app.use(cors.enableCORS);
	}
};
