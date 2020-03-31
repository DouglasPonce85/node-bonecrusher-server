/* eslint-disable no-unused-expressions */
/* eslint-disable global-require */
/* eslint-disable no-undef */

const knex = require('..')();
const chai = require('chai');
const mock = require('mock-require');
const chaiExclude = require('chai-exclude');

const Dataset = require('../../src/models/dataset');
const mockOrganizations = require('../../src/configs/mockData/organizations');
const mockDatasets = require('../../src/configs/mockData/datasets');

chai.use(chaiExclude);
const { expect } = chai;


describe('Dataset Controller Test', () => {
	let DatasetController;

	before(async () => {
		mock('../../src/models', { Dataset });
		DatasetController = require('../../src/controllers/dataset');
		Dataset.knex(knex);

		// Creates schema
		await knex.migrate.latest();

		// Insert mock data
		await knex.batchInsert('ORGANIZATIONS', mockOrganizations);
		await knex.batchInsert('DATASETS', mockDatasets);
	});

	after(async () => {
		await knex.destroy();
		mock.stopAll();
	});


	it('Should respond with all datasets in database', async () => {
		const req = {
			body: {}
		};

		const res = {
			sendCalledWith: '',
			send(arg) {
				this.sendCalledWith = arg;
			}
		};

		const expectedResponse = {
			data:
				[
					{
						id: 1,
						organization_id: 1,
						name: 'LEAR',
						code: '0504',
						source: 'TEST',
						description: 'TEST - DATASET',
						lastupdated: '2019-06-26 02:22:29'
					},
					{
						id: 2,
						organization_id: 2,
						name: 'WICK',
						code: '0906',
						source: 'DEV',
						description: 'DEV - SOURCE',
						lastupdated: '2019-06-26 02:22:29'
					},
					{
						id: 3,
						organization_id: 2,
						name: 'TEST',
						code: '0706',
						source: 'TEST',
						description: 'TEST',
						lastupdated: '2019-06-26 02:22:29'
					}
				]
		};

		await DatasetController.getAllDatasets(req, res);
		expect(res.sendCalledWith).to.be.an('object');
		expect(res.sendCalledWith.datasets).excluding('lastupdated').to.deep.equal(expectedResponse.data);
	});


	it('Should respond with all datasets for a specific organization Id', async () => {
		const expectedDatasets = [
			{
				id: 2,
				organization_id: 2,
				name: 'WICK',
				code: '0906',
				source: 'DEV',
				description: 'DEV - SOURCE',
				lastupdated: '2019-06-25 18:33:46',
				organization_name: 'Merck',
				organization_code: 'MERCK',
				clusterid: 'us0201',
				crmsid: '700040'
			},
			{
				id: 3,
				organization_id: 2,
				name: 'TEST',
				code: '0706',
				source: 'TEST',
				description: 'TEST',
				lastupdated: '2019-06-25 18:33:46',
				organization_name: 'Merck',
				organization_code: 'MERCK',
				clusterid: 'us0201',
				crmsid: '700040'
			}
		];

		const req = {
			params: {
				id: 2
			}
		};

		const res = {
			sendCalledWith: '',
			send(arg) {
				this.sendCalledWith = arg;
			}
		};

		await DatasetController.getDatasetsByOrganizationId(req, res);
		expect(res.sendCalledWith).to.be.an('object');
		expect(res.sendCalledWith.datasets).excluding('lastupdated').to.deep.equal(expectedDatasets)
	});


	it('Should create a Dataset with data sent on body', async () => {
		const req = {
			body: {
				organization_id: 1,
				name: 'LEAR',
				code: '0504',
				source: 'TEST',
				description: 'TEST - DATASET',
				lastupdated: '2019-06-25 16:44:56'
			}
		};
		const expectedDataset = {
			id: 4,
			organization_id: 1,
			name: 'LEAR',
			code: '0504',
			source: 'TEST',
			description: 'TEST - DATASET',
			lastupdated: '2019-06-25 16:44:56'
		};

		const res = {
			sendCalledWith: '',
			send(arg) {
				this.sendCalledWith = arg;
			}
		};

		await DatasetController.create(req, res);
		expect(res.sendCalledWith).to.be.an('object');
		expect(res.sendCalledWith.dataset).to.deep.equal(expectedDataset);
	});


	// -----------------
	// DELETE /datasets
	// -----------------
	it('Should delete a dataset by ID', async () => {
		const baseDataset = {
			organization_id: 1,
			name: 'DELETE-DATASET-TEST',
			code: '0504',
			source: 'TEST',
			description: 'TEST - DATASET',
			lastupdated: '2019-06-25 16:44:56'
		};

		const req = {
			params: {
				id: 4
			},
			body: {
				organization_id: 1,
				name: 'LEAR',
				code: '0504',
				source: 'TEST',
				description: 'TEST - DATASET',
				lastupdated: '2019-06-25 16:44:56'
			}
		};

		const res = {
			sendCalledWith: '',
			send(arg) {
				this.sendCalledWith = arg;
			}
		};

		await Dataset.query().insert(baseDataset);
		await DatasetController.deleteDatasetById(req, res);

		expect(res.sendCalledWith).to.be.an('object');
		expect(res.sendCalledWith.result).to.equal(1);
	});

	it('Should only update lastupdated field of dataset', async () => {

		const baseDataset = {
			organization_id: 1,
			name: 'PUT-LASTUPDATED-TEST',
			code: '0600',
			source: 'TEST',
			description: 'TEST - DATASET',
			lastupdated: '2019-06-25 16:44:56'
		};

		const req = {
			params: {
				ocode: 'IQVIA',
				dcode: '0600'
			}
		};

		const res = {
			sendCalledWith: '',
			send(arg) {
				this.sendCalledWith = arg;
			}
		};

		await Dataset.query().insert(baseDataset);

		await DatasetController.updateLastUpdated(req, res);

		expect(res.sendCalledWith).to.be.an('object');
		expect(res.sendCalledWith.result).to.equal(1);
	});


	// -----------------
	// PUT /datasets
	// -----------------
	it('Should update a Dataset by ID', async () => {
		const baseDataset = {
			CODE: '0504',
			DESCRIPTION: 'TEST - DATASET',
			NAME: 'DATASET',
			ORGANIZATION_ID: 1,
			SOURCE: 'TEST'
		};
		const expectedDataset = {
			CODE: '0504',
			DESCRIPTION: 'DESCRIPTION - TEST',
			ID: 5,
			LASTUPDATED: '2019-06-25 16:44:56',
			NAME: 'NAME-TEST',
			ORGANIZATION_ID: 1,
			SOURCE: 'TEST'
		};

		const req = {
			params: {
				id: 5
			},
			body: {
				CODE: '0504',
				DESCRIPTION: 'DESCRIPTION - TEST',
				NAME: 'NAME-TEST',
				ORGANIZATION_ID: 1,
				SOURCE: 'TEST'
			}
		};
		const res = {
			sendCalledWith: {},
			send(arg) {
				this.sendCalledWith = arg;
			}
		};

		await Dataset.query().insert(baseDataset);
		await DatasetController.updateDatasetById(req, res);
		const data = await Dataset.query().findById(req.params.id);

		expect(res.sendCalledWith).to.be.an('object');
		expect(res.sendCalledWith).to.deep.equal(expectedDataset);
		expect(data).to.deep.equal(expectedDataset);
	});

	it('Should get error status if no Dataset is updated', async () => {
		const baseDataset = {
			CODE: '0504',
			DESCRIPTION: 'TEST - DATASET',
			NAME: 'DATASET',
			ORGANIZATION_ID: 1,
			SOURCE: 'TEST'
		};

		const id = 77;
		const { tableName } = Dataset;
		const expectedMsg = `Could not update from the specified table [${tableName}]. No record found for ID [${id}].`;

		const req = {
			params: {
				id
			},
			body: {
				CODE: '0504',
				DESCRIPTION: 'DESCRIPTION - TEST',
				NAME: 'NAME-TEST',
				ORGANIZATION_ID: 1,
				SOURCE: 'TEST'
			}
		};
		const res = {
			sendCalledWith: '',
			send(arg) {
				this.sendCalledWith = arg;
			}
		};

		await Dataset.query().insert(baseDataset);
		await DatasetController.updateDatasetById(req, res);

		expect(res.sendCalledWith).to.be.an('string');
		expect(res.sendCalledWith).to.deep.equal(expectedMsg);
	});
});
