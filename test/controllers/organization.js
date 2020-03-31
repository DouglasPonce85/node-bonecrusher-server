/* eslint-disable global-require */
/* eslint-disable no-undef */

const knex = require('..')();
const { expect } = require('chai');
const mock = require('mock-require');

const Organization = require('../../src/models/organization');
const User = require('../../src/models/user');
const mockOrganizations = require('../../src/configs/mockData/organizations');
const mockUsers = require('../../src/configs/mockData/users');

describe('Organization Controller Test', () => {
	let OrganizationController;

	before(async () => {
		mock('../../src/models', { User, Organization });
		OrganizationController = require('../../src/controllers/organization');
		Organization.knex(knex);
		User.knex(knex);

		// Creates schema
		await knex.migrate.latest();

		// Insert mock data
		await knex.batchInsert('ORGANIZATIONS', mockOrganizations);
	});

	after(async () => {
		await knex.destroy();
		mock.stopAll();
	});


	it('Should create a Organization with data sent on body', async () => {
		const req = {
			body: {
				name: 'TEST',
				code: 'TEST',
				clusterid: '9',
				crmsid: '9'
			}
		};
		const expectedOrganization = {
			id: 3,
			name: 'TEST',
			code: 'TEST',
			clusterid: '9',
			crmsid: '9'
		};

		const res = {
			sendCalledWith: '',
			send(arg) {
				this.sendCalledWith = arg;
			}
		};

		await OrganizationController.create(req, res);
		expect(res.sendCalledWith).to.be.an('object');
		expect(res.sendCalledWith.organization).to.deep.equal(expectedOrganization);
	});


	// -----------------------
	// DELETE /Organizations
	// -----------------------
	it('Should delete a Organization by ID', async () => {
		const baseOrganization = {
			NAME: 'TEST',
			CODE: 'TEST',
			CLUSTERID: '9',
			CRMSID: '9'
		};
		const req = {
			params: {
				id: 3
			},
			body: {
				NAME: 'TEST',
				CODE: 'TEST',
				CLUSTERID: '9',
				CRMSID: '9'
			}
		};

		const res = {
			sendCalledWith: '',
			send(arg) {
				this.sendCalledWith = arg;
			}
		};

		await Organization.query().insert(baseOrganization);
		await OrganizationController.deleteOrganizationById(req, res);

		expect(res.sendCalledWith).to.be.an('object');
		expect(res.sendCalledWith.result).to.equal(1);
	});

	// -----------------
	// PUT /Organizations
	// -----------------
	it('Should update an Organization by ID', async () => {
		const expectedId = 4;
		const baseOrganization = {
			CLUSTERID: '9',
			CODE: 'TEST',
			CRMSID: '9',
			NAME: 'TEST'
		};
		const expectedOrganization = {
			ID: expectedId,
			CLUSTERID: '9',
			CODE: 'TEST',
			CRMSID: '9',
			NAME: 'UPDATE-TEST'
		};

		const req = {
			params: {
				id: expectedId
			},
			body: {
				CLUSTERID: '9',
				CRMSID: '9',
				CODE: 'TEST',
				NAME: 'UPDATE-TEST'
			}
		};
		const res = {
			sendCalledWith: {},
			send(arg) {
				this.sendCalledWith = arg;
			}
		};

		await Organization.query().insert(baseOrganization);
		await OrganizationController.updateOrganizationById(req, res);
		const data = await Organization.query().findById(req.params.id);

		expect(res.sendCalledWith).to.be.an('object');
		expect(res.sendCalledWith).to.deep.equal(expectedOrganization);
		expect(data).to.deep.equal(expectedOrganization);
	});

	it('Should get error status if no Organization is updated', async () => {
		const baseOrganization = {
			CLUSTERID: '9',
			CRMSID: '9',
			CODE: 'TEST',
			NAME: 'UPDATE-TEST'
		};

		const id = 77;
		const { tableName } = Organization;
		const expectedMsg = `Could not update from the specified table [${tableName}]. No record found for ID [${id}].`;

		const req = {
			params: {
				id
			},
			body: {
				CLUSTERID: '9',
				CRMSID: '9',
				CODE: 'TEST',
				NAME: 'UPDATE-TEST'
			}
		};
		const res = {
			sendCalledWith: '',
			send(arg) {
				this.sendCalledWith = arg;
			}
		};

		await Organization.query().insert(baseOrganization);
		await OrganizationController.updateOrganizationById(req, res);

		expect(res.sendCalledWith).to.be.an('string');
		expect(res.sendCalledWith).to.deep.equal(expectedMsg);
	});
});
