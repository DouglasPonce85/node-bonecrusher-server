/* eslint-disable global-require */
/* eslint-disable no-undef */

const knex = require('..')();
const mock = require('mock-require');
const { expect } = require('chai');

const User = require('../../src/models/user');
const mockOrganizations = require('../../src/configs/mockData/organizations');
const mockUsers = require('../../src/configs/mockData/users');


describe('User Controller Test', () => {
	let UserController;

	before(async () => {
		mock('../../src/models', { User });
		UserController = require('../../src/controllers/user');
		User.knex(knex);

		// Creates schema
		await knex.migrate.latest();

		// Insert mock data
		await knex.batchInsert('ORGANIZATIONS', mockOrganizations);
		await knex.batchInsert('USERS', mockUsers);
	});

	after(async () => {
		await knex.destroy();
		mock.stopAll();
	});

	it('Should respond with all users in database', async () => {
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
			users: [
				{
					id: 1,
					organization_id: 1,
					login: 'jellis@us.imshealth.com',
					firstname: 'Joshua',
					lastname: 'Ellis',
					type: 3
				},
				{
					id: 21,
					organization_id: 1,
					login: 'doug@bairesdev.com',
					firstname: 'Douglas',
					lastname: 'Ponce',
					type: 3
				}
			]
		};

		await UserController.getAllUsers(req, res);
		expect(res.sendCalledWith).to.be.an('object');
		expect(res.sendCalledWith).to.deep.equal(expectedResponse);
	});


	it('Should respond user by Id', async () => {
		const req = {
			params: {
				id: 1
			}
		};

		const res = {
			sendCalledWith: '',
			send(arg) {
				this.sendCalledWith = arg;
			}
		};

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

		await UserController.getUserById(req, res);
		expect(res.sendCalledWith).to.be.an('object');
		expect(res.sendCalledWith).to.deep.equal(expectedResponse);
	});


	it('Should get users by organization Id', async () => {
		const req = {
			params: {
				id: 1
			}
		};

		const res = {
			sendCalledWith: '',
			send(arg) {
				this.sendCalledWith = arg;
			}
		};

		const expectedResponse = {
			users: [
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
			]
		};

		await UserController.getUsersByOrganizationId(req, res);
		expect(res.sendCalledWith).to.be.an('object');
		expect(res.sendCalledWith).to.deep.equal(expectedResponse);
	});


	it('Should create a user with data sent on body', async () => {
		const req = {
			body: {
				organization_id: 1,
				login: 'testing@gmail.com',
				firstname: 'Testing',
				lastname: 'Testing',
				type: 2
			}
		};
		const expectedUser = {
			organization_id: 1,
			login: 'testing@gmail.com',
			firstname: 'Testing',
			lastname: 'Testing',
			type: 2,
			id: 22
		};

		const res = {
			sendCalledWith: '',
			send(arg) {
				this.sendCalledWith = arg;
			}
		};

		await UserController.create(req, res);
		expect(res.sendCalledWith).to.be.an('object');
		expect(res.sendCalledWith.user).to.deep.equal(expectedUser);
	});


	// ---------------
	// DELETE /Users
	// ---------------
	it('Should delete a User by ID', async () => {
		const baseUser = {
			organization_id: 1,
			login: 'testing@gmail.com',
			firstname: 'TEST-USER-DELETE',
			lastname: 'TEST-USER-DELETE',
			type: 2
		};
		const req = {
			params: {
				id: 23
			},
			body: {
				organization_id: 1,
				login: 'testing@gmail.com',
				firstname: 'TEST-USER',
				lastname: 'TEST-USER',
				type: 2
			}
		};

		const res = {
			sendCalledWith: '',
			send(arg) {
				this.sendCalledWith = arg;
			}
		};

		await User.query().insert(baseUser);
		await UserController.deleteUserById(req, res);

		expect(res.sendCalledWith).to.be.an('object');
		expect(res.sendCalledWith.result).to.equal(1);
	});

	// ------------
	// PUT /Users
	// ------------
	it('Should update an User by ID', async () => {
		const expectedId = 24;
		const baseUser = {
			FIRSTNAME: 'TEST',
			LASTNAME: 'TEST',
			LOGIN: 'test@test.com',
			ORGANIZATION_ID: 1,
			TYPE: 3
		};
		const expectedUser = {
			ID: expectedId,
			FIRSTNAME: 'UPDATE-TEST',
			LASTNAME: 'UPDATE-TEST',
			LOGIN: 'test@test.com',
			ORGANIZATION_ID: 1,
			TYPE: 3
		};

		const req = {
			params: {
				id: expectedId
			},
			body: {
				FIRSTNAME: 'UPDATE-TEST',
				LASTNAME: 'UPDATE-TEST',
				LOGIN: 'test@test.com',
				ORGANIZATION_ID: 1,
				TYPE: 3
			}
		};
		const res = {
			sendCalledWith: {},
			send(arg) {
				this.sendCalledWith = arg;
			}
		};

		await User.query().insert(baseUser);
		await UserController.updateUserById(req, res);
		const data = await User.query().findById(req.params.id);

		expect(res.sendCalledWith).to.be.an('object');
		expect(res.sendCalledWith).to.deep.equal(expectedUser);
		expect(data).to.deep.equal(expectedUser);
	});

	it('Should get error status if no User is updated', async () => {
		const baseUser = {
			FIRSTNAME: 'TEST',
			LASTNAME: 'TEST',
			LOGIN: 'test@test.com',
			ORGANIZATION_ID: 1,
			TYPE: 3
		};

		const id = 77;
		const { tableName } = User;
		const expectedMsg = `Could not update from the specified table [${tableName}]. No record found for ID [${id}].`;

		const req = {
			params: {
				id
			},
			body: {
				FIRSTNAME: 'UPDATE-TEST',
				LASTNAME: 'UPDATE-TEST',
				LOGIN: 'test@test.com',
				ORGANIZATION_ID: 1,
				TYPE: 3
			}
		};
		const res = {
			sendCalledWith: '',
			send(arg) {
				this.sendCalledWith = arg;
			}
		};

		await User.query().insert(baseUser);
		await UserController.updateUserById(req, res);

		expect(res.sendCalledWith).to.be.an('string');
		expect(res.sendCalledWith).to.deep.equal(expectedMsg);
	});
});
