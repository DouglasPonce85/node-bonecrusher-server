/* eslint-disable no-restricted-globals */
const helper = require('./helper');
const consts = require('../configs/consts');

async function modelUpdateById(model, req, res, next) {
	try {
		const { id } = req.params;

		if (!id) res.send({ data: 'Please provide a valid ID' });
		if (!req.body) res.send({ data: 'Please provide valid info' });

		const modelUpdated = await model.query().updateAndFetchById(id, req.body);
		return modelUpdated;
	} catch (err) {
		helper.controllerErrorRaised('modelUpdateById', err, next);
		return null;
	}
}

async function modelDeleteById(model, req, res, next) {
	try {
		const { id } = req.params;
		if (!id || !isNaN(id)) {
			const result = await model.query().deleteById(id);
			if (result === 1) {
				res.send({ result });
			} else {
				const { tableName } = model;
				res.status(consts.codeErrorStatus);
				res.send({ result: `Could not delete from [${tableName}]. No record found for ID [${id}].` });
			}
		} else {
			res.status(consts.codeErrorStatus);
			res.send({ result: 'Please provide a valid info' });
		}
	} catch (err) {
		helper.controllerErrorRaised('modelDeleteById', err, next);
	}
}

module.exports = {
	modelUpdateById,
	modelDeleteById
};
