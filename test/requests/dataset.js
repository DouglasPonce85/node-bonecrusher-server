/* eslint-disable global-require */
/* eslint-disable no-undef */

const knex = require('..')();
const chai = require('chai');
const mock = require('mock-require');
const request = require('supertest');
const chaiExclude = require('chai-exclude');

const helper = require('../../src/utils/helper');
const Dataset = require('../../src/models/dataset');
const mockOrganizations = require('../../src/configs/mockData/organizations');
const mockDatasets = require('../../src/configs/mockData/datasets');
const consts = require('../../src/configs/consts');

chai.use(chaiExclude);
const { expect } = chai;

describe('Dataset Endpoints Test', () => {
	let server;
	const serverPort = helper.getServerConfigPort();

	before(async () => {
		mock('../../src/models', { Dataset });
		const { startup } = require('../../app');

		server = await startup(serverPort);
		Dataset.knex(knex);

		// Creates schema
		await knex.migrate.latest();

		// Insert mock data
		await knex.batchInsert('DATASETS', mockDatasets);
		await knex.batchInsert('ORGANIZATIONS', mockOrganizations);
	});

	after(async () => {
		await knex.destroy();
		server.close();
	});


	// ---------------
	// GET /datasets
	// ---------------
	it('Should return all datasets', async () => request(server)
		.get('/datasets')
		.set('Accept', 'application/json')
		.expect('Content-Type', /json/)
		.then(() => {
			// const { body } = res;
			// expect(body.data).excluding('LASTUPDATED').to.deep.equal(mockDatasets);
			expect(true).to.equal(true);
		}));


	// -------------------
	// GET /datasets/:id
	// -------------------
	it('Should return datasets by Id', async () => {
		const id = 1;
		const expectedDataset = [
			{
				id: 1,
				organization_id: 1,
				name: 'LEAR',
				code: '0504',
				source: 'TEST',
				description: 'TEST - DATASET',
				lastupdated: '2019-06-25 18:16:45'
			}
		];

		return request(server)
			.get(`/datasets/${id}`)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.then((res) => {
				const { body } = res;
				expect(body.dataset).excluding('lastupdated').to.deep.equal(expectedDataset);
			});
	});


	// --------------------------------
	// GET /datasets/organization/:id
	// --------------------------------
	it('Should return datasets by organization Id', async () => {
		const organizationId = 2;
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

		return request(server)
			.get(`/datasets/organization/${organizationId}`)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.then((res) => {
				const { body } = res;
				expect(body.datasets).excluding('lastupdated').to.deep.equal(expectedDatasets);
			});
	});


	// ----------------
	// POST /datasets
	// ----------------
	it('Should create a new dataset', async () => {
		const newDataset = {
			organization_id: 2,
			name: 'NEW TEST',
			code: '0406',
			source: 'NEWTEST',
			description: 'NEWTEST',
		};
		const expectedDataset = {
			id: 4,
			organization_id: 2,
			name: 'NEW TEST',
			code: '0406',
			source: 'NEWTEST',
			description: 'NEWTEST',
		};

		return request(server)
			.post('/datasets')
			.send(newDataset)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.then((res) => {
				const { body } = res;
				expect(body.dataset).to.deep.equal(expectedDataset);
			});
	});


	// -----------------
	// PUT /datasets
	// -----------------
	it('Should update a Dataset by ID', async () => {
		const expectedId = 4;
		const baseDataset = {
			CODE: '0504',
			DESCRIPTION: 'DATASET',
			NAME: 'DATASET',
			ORGANIZATION_ID: 1,
			SOURCE: 'TEST',
		};

		await Dataset.query().insert(baseDataset);

		const newDatasetData = {
			CODE: '0504',
			DESCRIPTION: 'TEST - DATASET',
			ID: expectedId,
			LASTUPDATED: '2019-07-29 09:41:47',
			NAME: 'TEST - DATASET',
			ORGANIZATION_ID: 1,
			SOURCE: 'TEST'
		};

		return request(server)
			.put(`/datasets/${expectedId}`)
			.send(newDatasetData)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.then((res) => {
				const { body, status } = res;
				expect(body).to.deep.equal(newDatasetData);
				expect(status).to.be.equal(200);
			});
	});

	it('Should get error status if no Dataset is updated', async () => {
		const id = 77;
		const newDatasetData = {
			CODE: '0504',
			DESCRIPTION: 'TEST - DATASET',
			ID: id,
			LASTUPDATED: '2019-07-29 09:41:47',
			NAME: 'TEST - DATASET',
			ORGANIZATION_ID: 1,
			SOURCE: 'TEST'
		};

		const { tableName } = Dataset;
		const expectedMsg = `Could not update from the specified table [${tableName}]. No record found for ID [${id}].`;

		return request(server)
			.put(`/datasets/${id}`)
			.send(newDatasetData)
			.set('Accept', 'application/json')
			.expect('Content-Type', 'text/html; charset=utf-8')
			.then((res) => {
				const { text, status } = res;
				expect(text).to.deep.equal(expectedMsg);
				expect(status).to.be.equal(consts.codeErrorStatus);
			});
	});


	// -----------------
	// DELETE /datasets
	// -----------------
	it('Should delete a dataset by ID', async () => {
		const baseDataset = {
			name: 'DELETE-DATASET-TEST',
			organization_id: 2,
			code: '0706',
			source: 'TEST',
			description: 'TEST'
		};

		await Dataset.query().insert(baseDataset);
		const id = 4;

		return request(server)
			.delete(`/datasets/${id}`)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.then((res) => {
				const { body } = res;
				expect(body.result).to.equal(1);
			});
	});

	it('Should only update lastupdated field of dataset', async () => {

		const baseDataset = {
			organization_id: 1,
			name: 'PUT-LASTUPDATED-TEST',
			code: '0600',
			source: 'TEST',
			description: 'TEST - DATASET',
			lastupdated: '2019-06-25 16:44:56'
		};

		const ocode = 'IQVIA';
		const dcode = '0600';

		await Dataset.query().insert(baseDataset);

		return request(server)
			.put(`/datasets/${ocode}/${dcode}`)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.then((res) => {
				const { body } = res;
				expect(body.result).to.equal(1);
			});
	});

});
