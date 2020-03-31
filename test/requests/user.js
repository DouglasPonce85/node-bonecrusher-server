/* eslint-disable global-require */
/* eslint-disable no-undef */

const knex = require('..')();
const mock = require('mock-require');
const { expect } = require('chai');
const request = require('supertest');

const formatter = require('../../src/utils/formatter');
const helper = require('../../src/utils/helper');
const User = require('../../src/models/user');
const mockOrganizations = require('../../src/configs/mockData/organizations');
const mockUsers = require('../../src/configs/mockData/users');
const consts = require('../../src/configs/consts');


describe('User Endpoints Test', () => {
	let server;
	const serverPort = helper.getServerConfigPort();

	before(async () => {
		mock('../../src/models', { User });
		const { startup } = require('../../app');

		server = await startup(serverPort);
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


	// -------------
	// GET /users
	// -------------
	it('Should return all users', async () => {

		const formattedUsers = await formatter.changeKeysCase(mockUsers, false);

		return request(server)
			.get('/users')
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.then((res) => {
				const { body } = res;
				expect(body.users).to.deep.equal(formattedUsers);
			});
	})


	// ----------------
	// GET /users/:id
	// ----------------
	it('Should return user by Id', async () => {
		const id = 1;
		const expectedResponse = {
			users: [
				{
					id: 1,
					organization_id: 1,
					login: 'jellis@us.imshealth.com',
					firstname: 'Joshua',
					lastname: 'Ellis',
					type: 3
				}
			]
		};

		return request(server)
			.get(`/users/${id}`)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.then((res) => {
				const { body } = res;
				expect(body.users).to.deep.equal(expectedResponse.users);
			});
	});


	// ------------------------------
	// GET /users/organization/:id
	// ------------------------------
	it('Should return users by organization Id', async () => {
		const id = 1;
		const expectedUser = [
			{
				id: 1,
				organization_id: 1,
				login: 'jellis@us.imshealth.com',
				firstname: 'Joshua',
				lastname: 'Ellis',
				type: 3,
				name: 'IQVIA',
				code: 'IQVIA',
				clusterid: '0',
				crmsid: '0'
			},
			{
				id: 21,
				organization_id: 1,
				login: 'doug@bairesdev.com',
				firstname: 'Douglas',
				lastname: 'Ponce',
				type: 3,
				name: 'IQVIA',
				code: 'IQVIA',
				clusterid: '0',
				crmsid: '0'
			}
		];

		return request(server)
			.get(`/users/organization/${id}`)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.then((res) => {
				const { body } = res;
				expect(body.users).to.deep.equal(expectedUser);
			});
	});


	// --------------
	// POST /Users
	// --------------
	it('Should create a new user', async () => {
		const newUser = {
			organization_id: 1,
			login: 'testing@gmail.com',
			firstname: 'Testing',
			lastname: 'Testing',
			type: 2
		};

		const expectedUser = {
			id: 22,
			organization_id: 1,
			login: 'testing@gmail.com',
			firstname: 'Testing',
			lastname: 'Testing',
			type: 2
		};

		return request(server)
			.post('/users')
			.send(newUser)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.then((res) => {
				const { body } = res;
				expect(body.user).to.deep.equal(expectedUser);
			});
	});


	// ------------
	// PUT /Users
	// ------------
	it('Should update an Organization by ID', async () => {
		const expectedId = 23;
		const baseUser = {
			FIRSTNAME: 'TEST',
			LASTNAME: 'TEST',
			LOGIN: 'test@test.com',
			ORGANIZATION_ID: 1,
			TYPE: 3
		};
		const newUserData = {
			FIRSTNAME: 'UPDATE-TEST',
			LASTNAME: 'UPDATE-TEST',
			LOGIN: 'test@test.com',
			ORGANIZATION_ID: 1,
			TYPE: 3,
			ID: expectedId
		};

		await User.query().insert(baseUser);

		return request(server)
			.put(`/users/${expectedId}`)
			.send(newUserData)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.then((res) => {
				const { body, status } = res;
				expect(body).to.deep.equal(newUserData);
				expect(status).to.be.equal(200);
			});
	});

	it('Should get error status if no User is updated', async () => {
		const id = 77;
		const newUserData = {
			FIRSTNAME: 'UPDATE-TEST',
			LASTNAME: 'UPDATE-TEST',
			LOGIN: 'test@test.com',
			ORGANIZATION_ID: 1,
			TYPE: 3,
			ID: id
		};

		const { tableName } = User;
		const expectedMsg = `Could not update from the specified table [${tableName}]. No record found for ID [${id}].`;

		return request(server)
			.put(`/users/${id}`)
			.send(newUserData)
			.set('Accept', 'application/json')
			.expect('Content-Type', 'text/html; charset=utf-8')
			.then((res) => {
				const { text, status } = res;
				expect(text).to.deep.equal(expectedMsg);
				expect(status).to.be.equal(consts.codeErrorStatus);
			});
	});


	// ---------------
	// DELETE /users
	// ---------------
	it('Should delete a user by ID', async () => {
		const baseUser = {
			organization_id: 1,
			login: 'testing@gmail.com',
			firstname: 'TEST-USER-DELETE',
			lastname: 'TEST-USER-DELETE',
			type: 2
		};

		await User.query().insert(baseUser);
		const id = 23;

		return request(server)
			.delete(`/users/${id}`)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.then((res) => {
				const { body } = res;
				expect(body.result).to.equal(1);
			});
	});
});
