/* eslint-disable no-unused-expressions */
/* eslint-disable global-require */
/* eslint-disable no-undef */

const knex = require('..')();
const { expect } = require('chai');

const User = require('../../src/models/user');
const mockOrganizations = require('../../src/configs/mockData/organizations');
const mockUsers = require('../../src/configs/mockData/users');
const mockUserProducts = require('../../src/configs/mockData/userproducts');
const mockProducts = require('../../src/configs/mockData/products');


describe('User Model Test', () => {
	before(async () => {
		User.knex(knex);

		// Creates schema
		await knex.migrate.latest();

		// Insert mock data
		await knex.batchInsert('ORGANIZATIONS', mockOrganizations);
		await knex.batchInsert('USERS', mockUsers);
		await knex.batchInsert('USERPRODUCTS', mockUserProducts);
		await knex.batchInsert('PRODUCTS', mockProducts);
	});

	after(async () => {
		await knex.destroy();
	});


	// ---------------
	// GET all users
	// ---------------
	it('Should get all users', async () => {
		const data = await User.query();
		expect(data.length).to.equal(2);
	});


	// ---------------
	// GET user by ID
	// ---------------
	it('Should get user by id', async () => {
		const expectedUser = {
			ID: 21,
			ORGANIZATION_ID: 1,
			LOGIN: 'doug@bairesdev.com',
			FIRSTNAME: 'Douglas',
			LASTNAME: 'Ponce',
			TYPE: 3
		};
		const userOne = await User.query().findById(21);

		expect(userOne).to.not.be.null;
		expect(userOne).to.deep.equal(expectedUser);
	});


	// ----------------------------------
	// GET all users by organization ID
	// ----------------------------------
	it('Should get users by organization id', async () => {
		const organizationId = 1;
		const expectedUsers = [
			{
				ID: 1,
				ORGANIZATION_ID: 1,
				LOGIN: 'jellis@us.imshealth.com',
				FIRSTNAME: 'Joshua',
				LASTNAME: 'Ellis',
				TYPE: 3,
				NAME: 'IQVIA',
				CODE: 'IQVIA',
				CLUSTERID: '0',
				CRMSID: '0'
			},
			{
				ID: 1,
				ORGANIZATION_ID: 1,
				LOGIN: 'doug@bairesdev.com',
				FIRSTNAME: 'Douglas',
				LASTNAME: 'Ponce',
				TYPE: 3,
				NAME: 'IQVIA',
				CODE: 'IQVIA',
				CLUSTERID: '0',
				CRMSID: '0'
			}
		];
		const users = await User.query().select('*')
			.joinRelation('organization as o')
			.where('o.id', '=', organizationId);
		expect(users).to.not.be.null;
		expect(users).to.deep.equal(expectedUsers);
	});


	// ------------------------------
	// GET user by non-existent id
	// ------------------------------
	it('Should be null for non-existent user', async () => {
		const userOne = await User.query().findById(2);
		expect(userOne).to.be.undefined;
	});


	// ----------------
	// POST new user
	// ----------------
	it('Should create a new user', async () => {
		const newProduct = {
			ORGANIZATION_ID: 1,
			LOGIN: 'testing@gmail.com',
			FIRSTNAME: 'Testing',
			LASTNAME: 'Testing',
			TYPE: 2
		};
		const expectedProduct = {
			ID: 22,
			ORGANIZATION_ID: 1,
			LOGIN: 'testing@gmail.com',
			FIRSTNAME: 'Testing',
			LASTNAME: 'Testing',
			TYPE: 2
		};

		const data = await User.query().insert(newProduct);
		expect(data).to.deep.equal(expectedProduct);
	});


	//PUT product for user
	it('Should update a product for an organization', async () => {
		const userid = 1;
		const productid = 1;
		const enabled = false;
		const producturl = 'http://updateurltest.com';

		const [ before ] = await knex('USERPRODUCTS')
													.where('user_id', userid)
													.andWhere('product_id', productid)

		const result = await knex('USERPRODUCTS')
													.where('user_id', userid)
													.andWhere('product_id', productid)
													.update({ enabled });

		const [ after ] = await knex('USERPRODUCTS')
													.where('user_id', userid)
													.andWhere('product_id', productid)

		expect(before.ENABLED).to.equal(1);
		expect(result).to.equal(1);
		expect(after.ENABLED).to.equal(0);
	})
});
