const helper = require('../utils/helper');
const consts = require('../configs/consts');

module.exports = {
	urlNotDefinedHandler: (err, res) => {
		res.status(helper.getUrlNotDefinedStatus())
			.send({
				info: consts.urlNotDefinedErrorInfo,
				message: err.message
			});
	},
	controllerRaised: (err, res) => {
		res.status(helper.getCodeErrorStatus())
			.send({
				info: consts.controllerRaisedError,
				source: err.source,
				stackInfo: err.stackInfo
			});
	},
	unexpectedErrorRaised: (err, res) => {
		res.status(helper.getCodeErrorStatus())
			.send({
				info: consts.controllerRaisedError,
				stackInfo: err.stackInfo
			});
	}
};
