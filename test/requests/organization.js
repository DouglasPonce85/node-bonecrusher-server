/* eslint-disable global-require */
/* eslint-disable no-undef */

const knex = require('..')();
const { expect } = require('chai');
const mock = require('mock-require');
const request = require('supertest');

const formatter = require('../../src/utils/formatter');
const helper = require('../../src/utils/helper');
const Organization = require('../../src/models/organization');
const User = require('../../src/models/user');
const mockOrganizations = require('../../src/configs/mockData/organizations');
const mockUsers = require('../../src/configs/mockData/users');
const consts = require('../../src/configs/consts');


describe('Organization Endpoints Test', () => {
	let server;
	const serverPort = helper.getServerConfigPort();

	before(async () => {
		mock('../../src/models', { User, Organization });
		const { startup } = require('../../app');

		server = await startup(serverPort);
		Organization.knex(knex);
		User.knex(knex);

		// Creates schema
		await knex.migrate.latest();

		// Insert mock data
		await knex.batchInsert('ORGANIZATIONS', mockOrganizations);
		await knex.batchInsert('USERS', mockUsers);
	});

	after(async () => {
		await knex.destroy();
		await server.close();
		mock.stopAll();
	});


	// --------------------
	// GET /Organizations
	// --------------------
	it('Should return all organizations', async () => {
		const formattedOrganizations = await formatter.changeKeysCase(mockOrganizations, false);

		return request(server)
			.get('/organizations')
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.then((res) => {
				const { body } = res;
				expect(body.organizations).to.deep.equal(formattedOrganizations);
			});
	});


	// -------------------------
	// GET /Organizations/:id
	// -------------------------
	it('Should return organization by Id', async () => {
		const id = 1;
		const expectedOrganization = {
			id: 1,
			name: 'IQVIA',
			code: 'IQVIA',
			clusterid: '0',
			crmsid: '0'
		};

		return request(server)
			.get(`/organizations/${id}`)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.then((res) => {
				const { body } = res;
				expect(body.organization).to.deep.equal(expectedOrganization);
			});
	});


	// ---------------------
	// POST /Organizations
	// ---------------------
	it('Should create a new organization', async () => {
		const newOrganization = {
			name: 'TEST',
			code: 'TEST',
			clusterid: '9',
			crmsid: '9'
		};

		const expectedOrganization = {
			id: 3,
			name: 'TEST',
			code: 'TEST',
			clusterid: '9',
			crmsid: '9'
		};

		return request(server)
			.post('/organizations')
			.send(newOrganization)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.then((res) => {
				const { body } = res;
				expect(body.organization).to.deep.equal(expectedOrganization);
			});
	});


	// --------------------
	// PUT /Organizations
	// --------------------
	it('Should update an Organization by ID', async () => {
		const expectedId = 4;
		const baseOrganization = {
			CLUSTERID: '9',
			CRMSID: '9',
			CODE: 'TEST',
			NAME: 'UPDATE-TEST'
		};
		const newOrganizationData = {
			CLUSTERID: '9',
			CRMSID: '9',
			CODE: 'TEST',
			NAME: 'UPDATE-TEST',
			ID: expectedId
		};

		await Organization.query().insert(baseOrganization);

		return request(server)
			.put(`/organizations/${expectedId}`)
			.send(newOrganizationData)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.then((res) => {
				const { body, status } = res;
				expect(body).to.deep.equal(newOrganizationData);
				expect(status).to.be.equal(200);
			});
	});

	it('Should get error status if no Organization is updated', async () => {
		const id = 77;
		const newOrganizationData = {
			CLUSTERID: '9',
			CRMSID: '9',
			CODE: 'TEST',
			NAME: 'UPDATE-TEST',
			ID: id
		};

		const { tableName } = Organization;
		const expectedMsg = `Could not update from the specified table [${tableName}]. No record found for ID [${id}].`;

		return request(server)
			.put(`/organizations/${id}`)
			.send(newOrganizationData)
			.set('Accept', 'application/json')
			.expect('Content-Type', 'text/html; charset=utf-8')
			.then((res) => {
				const { text, status } = res;
				expect(text).to.deep.equal(expectedMsg);
				expect(status).to.be.equal(consts.codeErrorStatus);
			});
	});


	// -----------------------
	// DELETE /Organizations
	// -----------------------
	it('Should delete a Organizations by ID', async () => {
		const baseOrganization = {
			name: 'TEST',
			code: 'TEST',
			clusterid: '9',
			crmsid: '9'
		};

		await Organization.query().insert(baseOrganization);
		const id = 4;

		return request(server)
			.delete(`/organizations/${id}`)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.then((res) => {
				const { body } = res;
				expect(body.result).to.equal(1);
			});
	});
});
