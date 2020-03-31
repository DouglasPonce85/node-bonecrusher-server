/* eslint-disable no-unused-expressions */
/* eslint-disable global-require */
/* eslint-disable no-undef */

const knex = require('..')();
const { expect } = require('chai');

const Product = require('../../src/models/product');
const mockUsers = require('../../src/configs/mockData/users');
const mockProducts = require('../../src/configs/mockData/products');
const mockUserProducts = require('../../src/configs/mockData/userProducts');
const mockOrganizations = require('../../src/configs/mockData/organizations');
const mockOrganizationProducts = require('../../src/configs/mockData/organizationProducts');


describe('Product Model Test', () => {
	before(async () => {
		Product.knex(knex);

		// Creates schema
		await knex.migrate.latest();

		// Insert mock data
		await knex.batchInsert('USERS', mockUsers);
		await knex.batchInsert('PRODUCTS', mockProducts);
		await knex.batchInsert('USERPRODUCTS', mockUserProducts);
		await knex.batchInsert('ORGANIZATIONS', mockOrganizations);
		await knex.batchInsert('ORGANIZATIONPRODUCTS', mockOrganizationProducts);
	});

	after(async () => {
		await knex.destroy();
	});

	// GET all products
	it('Should get all products', async () => {
		const data = await Product.query();
		expect(data.length).to.equal(10);
	});

	// GET all products by user ID
	it('Should get products by user ID', async () => {
		const expectedProducts = [
			{
				ID: 1,
				NAME: 'Hue',
				ICON: 1,
				INFOURL: 'http://iqvia.com/',
				USER_ID: 1,
				PRODUCT_ID: 1,
				ENABLED: true,
				ORGANIZATION_ID: 1,
				LOGIN: 'jellis@us.imshealth.com',
				FIRSTNAME: 'Joshua',
				LASTNAME: 'Ellis',
				TYPE: 3
			}
		];

		const userId = 1;
		const data = await Product.query()
			.select('*')
			.leftJoinRelation('users as u')
			.where('u.id', '=', userId);
		expect(data).to.deep.equal(expectedProducts);
	});

	// GET all products by organization ID
	it('Should get products by organization ID', async () => {
		const expectedProducts = [
			{
				ID: 1,
				NAME: 'IQVIA',
				ICON: 1,
				INFOURL: 'http://iqvia.com/',
				ORGANIZATION_ID: 1,
				PRODUCT_ID: 1,
				ENABLED: true,
				PRODUCTURL: 'https://iqvia.com/',
				CODE: 'IQVIA',
				CLUSTERID: '0',
				CRMSID: '0'
			}
		];

		const organizationId = 1;
		const data = await Product.query()
			.select('*')
			.leftJoinRelation('organizations as o')
			.where('o.id', '=', organizationId);
		expect(data).to.deep.equal(expectedProducts);
	});

	// GET product by non-existent ID
	it('Should be null for non-existent product', async () => {
		const userOne = await Product.query().findById(2);
		expect(userOne).to.be.undefined;
	});

	// POST new product
	it('Should create a new product', async () => {
		const newProduct = {
			NAME: 'PRODUCT INSERT TEST',
			ICON: 22,
			INFOURL: 'http://testingproduct.pr'
		};
		const expectedProduct = {
			ID: 42,
			NAME: 'PRODUCT INSERT TEST',
			ICON: 22,
			INFOURL: 'http://testingproduct.pr'
		};

		const data = await Product.query().insert(newProduct);
		expect(data).to.deep.equal(expectedProduct);
	});
	
	// PUT (edit) a product
	it('Should update a product', async () => {
		const baseProduct = {
			NAME: 'PRODUCT INSERT TEST',
			ICON: 22,
			INFOURL: 'http://testingproduct.pr'
		};

		const newProduct = {
			NAME: 'PRODUCT PUT TEST',
			ICON: 23,
			INFOURL: 'http://updatetest.up'
		};
		const expectedProduct = {
			ID: 42,
			NAME: 'PRODUCT PUT TEST',
			ICON: 23,
			INFOURL: 'http://updatetest.up'
		};

		await Product.query().insert(baseProduct);
		const result = await Product.query().findById(42).patch(newProduct);
		const data = await Product.query().findById(42);
		expect(result).to.equal(1);
		expect(data).to.deep.equal(expectedProduct);
	});
	
	//DELETE a product
	it('Should delete a product', async () => {
		const baseProduct = {
			NAME: 'DELETE TEST',
			ICON: 20,
			INFOURL: 'http://deleteproduct.de'
		};

		await Product.query().insert(baseProduct);

		const result = await Product.query().deleteById(42);
		expect(result).to.equal(1);
	});


});
