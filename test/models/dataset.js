/* eslint-disable no-unused-expressions */
/* eslint-disable global-require */
/* eslint-disable no-undef */

const knex = require('..')();
const chai = require('chai');
const chaiExclude = require('chai-exclude');

const Dataset = require('../../src/models/dataset');
const mockOrganizations = require('../../src/configs/mockData/organizations');
const mockDatasets = require('../../src/configs/mockData/datasets');

chai.use(chaiExclude);
const { expect } = chai;


describe('Dataset Model Test', () => {
	before(async () => {
		Dataset.knex(knex);

		// Creates schema
		await knex.migrate.latest();

		// Insert mock data
		await knex.batchInsert('ORGANIZATIONS', mockOrganizations);
		await knex.batchInsert('DATASETS', mockDatasets);
	});

	after(async () => {
		await knex.destroy();
	});

	// GET all datasets
	it('Should get all datasets', async () => {
		const data = await Dataset.query();
		expect(data.length).to.equal(3);
	});

	// GET all datasets by dataset ID
	it('Should get dataset by ID', async () => {
		const datasetId = 2;
		const data = await Dataset.query().findById(datasetId);
		expect(data).to.deep.equal(data);
	});

	// GET all datasets by organization ID
	it('Should get datasets by organization ID', async () => {
		const organizationId = 2;
		const expectedDatasets = [
			{
				ID: 2,
				ORGANIZATION_ID: 2,
				NAME: 'WICK',
				CODE: '0906',
				SOURCE: 'DEV',
				DESCRIPTION: 'DEV - SOURCE',
				LASTUPDATED: '2019-06-25 18:33:46',
				ORGANIZATION_NAME: 'Merck',
				ORGANIZATION_CODE: 'MERCK',
				CLUSTERID: 'us0201',
				CRMSID: '700040'
			},
			{
				ID: 3,
				ORGANIZATION_ID: 2,
				NAME: 'TEST',
				CODE: '0706',
				SOURCE: 'TEST',
				DESCRIPTION: 'TEST',
				LASTUPDATED: '2019-06-25 18:33:46',
				ORGANIZATION_NAME: 'Merck',
				ORGANIZATION_CODE: 'MERCK',
				CLUSTERID: 'us0201',
				CRMSID: '700040'
			}
		];

		const data = await Dataset.query()
			.select('da.*', 'o.NAME as ORGANIZATION_NAME', 'o.CODE as ORGANIZATION_CODE', 'o.CLUSTERID', 'o.CRMSID')
			.from('DATASETS as DA')
			.joinRelation('organization as o')
			.where('o.id', '=', organizationId);
		expect(data).excluding('LASTUPDATED').to.deep.equal(expectedDatasets);
	});


	// GET dataset by non-existent ID
	it('Should be null for non-existent dataset', async () => {
		const userOne = await Dataset.query().findById(4);
		expect(userOne).to.be.undefined;
	});

	// POST new Dataset
	it('Should create a new dataset', async () => {
		const newDataset = {
			ORGANIZATION_ID: 1,
			NAME: 'LEAR',
			CODE: '0504',
			SOURCE: 'TEST',
			DESCRIPTION: 'TEST - DATASET',
			LASTUPDATED: '2019-06-25 16:44:56'
		};
		const expectedDataset = {
			ORGANIZATION_ID: 1,
			NAME: 'LEAR',
			CODE: '0504',
			SOURCE: 'TEST',
			DESCRIPTION: 'TEST - DATASET',
			LASTUPDATED: '2019-06-25 16:44:56',
			ID: 4
		};

		const data = await Dataset.query().insert(newDataset);
		expect(data).to.deep.equal(expectedDataset);
	});

	// PUT new lastupdated date to dataset
	it('Should update only the lastupdated field', async () => {
		const newDataset = {
			ORGANIZATION_ID: 1,
			NAME: 'LEAR',
			CODE: '0600',
			SOURCE: 'TEST',
			DESCRIPTION: 'TEST - DATASET',
			LASTUPDATED: '2019-06-25 16:44:56'
		};

		const expectedDataset = [
			{
				ORGANIZATION_ID: 1,
				NAME: 'LEAR',
				CODE: '0600',
				SOURCE: 'TEST',
				DESCRIPTION: 'TEST - DATASET',
				ID: 5
			}
		];
		const organizationId = 1;
		const code = '0600';
		const NOW = Dataset.fn.now();

		await Dataset.query().insert(newDataset);

		const result = await Dataset.query()
														.select('*')
														.from('datasets')
														.where('organization_id', organizationId)
														.andWhere('code', code).patch({ LASTUPDATED: NOW });

		const data = await Dataset.query()
														.select('*')
														.from('datasets')
														.where('organization_id', organizationId)
														.andWhere('code', code)


		expect(result).to.equal(1);
		expect(data).excluding('LASTUPDATED').to.deep.equal(expectedDataset);
	})
});
