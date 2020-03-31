const { Dataset } = require('../models');

const formatter = require('../utils/formatter');
const helper = require('../utils/helper');
const queryBuilder = require('../utils/queryBuilder');
const consts = require('../configs/consts');

module.exports = {
	create: async (req, res, next) => {
		try {
			const data = await Dataset.query().insert(req.body);
			const formattedData = await formatter.changeKeysCase(data, false);
			res.send({ dataset: formattedData });
		} catch (err) {
			helper.controllerErrorRaised('create', err, next);
		}
	},

	getAllDatasets: async (req, res, next) => {
		try {
			const data = await Dataset.query();
			const formattedData = await formatter.changeKeysCase(data, false);
			res.send({ datasets: formattedData });
		} catch (err) {
			helper.controllerErrorRaised('getAllDatasets', err, next);
		}
	},

	getDatasetById: async (req, res, next) => {
		try {
			const { id } = req.params;
			if (!id) res.send({});

			const data = await Dataset.query().findById(id);
			const formattedData = await formatter.changeKeysCase(data, false);
			res.send({ dataset: [formattedData] });
		} catch (err) {
			helper.controllerErrorRaised('getDatasetById', err, next);
		}
	},

	getDatasetsByOrganizationId: async (req, res, next) => {
		try {
			const { id } = req.params;
			const data = await Dataset.query()
				.select('da.*', 'o.NAME as ORGANIZATION_NAME', 'o.CODE as ORGANIZATION_CODE', 'o.CLUSTERID', 'o.CRMSID')
				.from('DATASETS as DA')
				.joinRelation('organization as o')
				.where('o.id', '=', id);
			const formattedData = await formatter.changeKeysCase(data, false);
			res.send({ datasets: formattedData });
		} catch (err) {
			helper.controllerErrorRaised('getDatasetsByOrganizationId', err, next);
		}
	},

	updateDatasetById: async (req, res, next) => {
		try {
			const datasetUpdated = await queryBuilder.modelUpdateById(Dataset, req, res, next);
			if (!datasetUpdated) {
				helper.rowNotUpdatedValidation(Dataset, req, res);
				return;
			}
			res.send(datasetUpdated);
		} catch (err) {
			helper.controllerErrorRaised('updateDatasetById', err, next);
		}
	},
	updateLastUpdated: async (req, res, next) => {
		try {
			const { dcode, ocode } = req.params;
			const NOW = Dataset.fn.now();
			const result = await Dataset.query()
								.patch({ LASTUPDATED: NOW })
								.whereIn('id', function(){
									this.select('da.id')
										.from('DATASETS as DA')
										.joinRelation('organization as o')
										.where('o.CODE', ocode)
										.where('da.code', dcode)
								});


			res.send({ result });
		} catch(err) {
			helper.controllerErrorRaised('updateLastUpdated', err, next);
		}
	},

	deleteDatasetById: async (req, res, next) => {
		try {
			await queryBuilder.modelDeleteById(Dataset, req, res, next);
		} catch (err) {
			helper.controllerErrorRaised('deleteDatasetById', err, next);
		}
	}
};
