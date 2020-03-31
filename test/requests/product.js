/* eslint-disable global-require */
/* eslint-disable no-undef */

const knex = require('..')();
const mock = require('mock-require');
const request = require('supertest');
const { expect } = require('chai');

const helper = require('../../src/utils/helper');
const formatter = require('../../src/utils/formatter');
const Product = require('../../src/models/product');
const mockUsers = require('../../src/configs/mockData/users');
const mockProducts = require('../../src/configs/mockData/products');
const mockUserProducts = require('../../src/configs/mockData/userProducts');
const mockOrganizations = require('../../src/configs/mockData/organizations');
const mockOrganizationProducts = require('../../src/configs/mockData/organizationProducts');


describe('Product Endpoints Test', () => {
	let server;
	const serverPort = helper.getServerConfigPort();

	before(async () => {
		mock('../../src/models', { Product });
		const { startup } = require('../../app');

		Product.knex(knex);
		server = await startup(serverPort);

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
		await server.close();
		mock.stopAll();
	});


	// ---------------
	// GET /products
	// ---------------
	it('Should return all products', async () => {

		const formattedProducts = await formatter.changeKeysCase(mockProducts, false);

		return request(server)
			.get('/products')
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.then((res) => {
				const { body } = res;
				expect(body.products).to.deep.equal(formattedProducts);
			});
	});


	// -------------------------
	// GET /products/user/:id
	// -------------------------
	it('Should return product by Id', async () => {
		const id = 1;
		const expectedProduct = [
			{
				id: 1,
				name: 'Hue',
				icon: 1,
				infourl: 'http://iqvia.com/'
			}
		];
		// const formattedProduct = await formatter.changeKeysCase(mockProducts, false);

		return request(server)
			.get(`/products/${id}`)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.then((res) => {
				const { body } = res;
				expect(body.products).to.deep.equal(expectedProduct);
			});
	});


	// ------------------------
	// GET /products/user/:id
	// ------------------------
	it('Should return products by user Id joined query', async () => {
		const userId = 1;
		const expectedProducts = [
			{
				id: 1,
				name: 'Hue',
				icon: 1,
				infourl: 'http://iqvia.com/',
				user_id: 1,
				product_id: 1,
				enabled: true,
				organization_id: 1,
				login: 'jellis@us.imshealth.com',
				firstname: 'Joshua',
				lastname: 'Ellis',
				type: 3,
				producturl: 'https://iqvia.com/'
			}
		];

		return request(server)
			.get(`/products/user/${userId}`)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.then((res) => {
				const { body } = res;
				expect(body.products).to.deep.equal(expectedProducts);
			});
	});


	// ---------------------------------
	// GET /products/organization/:id
	// ---------------------------------
	it('Should return products by organization Id joined query', async () => {
		const organizationId = 1;
		const expectedProducts = [
			{
				id: 1,
				name: 'IQVIA',
				icon: 1,
				infourl: 'http://iqvia.com/',
				organization_id: 1,
				product_id: 1,
				enabled: true,
				producturl: 'https://iqvia.com/',
				code: 'IQVIA',
				clusterid: '0',
				crmsid: '0'
			}
		];

		return request(server)
			.get(`/products/organization/${organizationId}`)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.then((res) => {
				const { body } = res;
				expect(body.products).to.deep.equal(expectedProducts);
			});
	});


	// -----------------
	// POST /products
	// -----------------
	it('Should create a new product', async () => {
		const newProduct = {
			NAME: 'PRODUCT INSERT TEST',
			ICON: 22,
			INFOURL: 'http://testingproduct.pr'
		};
		const expectedProduct = {
			id: 42,
			name: 'PRODUCT INSERT TEST',
			icon: 22,
			infourl: 'http://testingproduct.pr'
		};

		return request(server)
			.post('/products')
			.send(newProduct)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.then((res) => {
				const { body } = res;
				expect(body.product).to.deep.equal(expectedProduct);
			});
	});

	// -----------------
	// PUT /products
	// -----------------
	it('Should update a product by ID with data sent on body', async () => {
		const baseProduct = {
			name: 'TESTPRODUCT',
			icon: 32,
			infourl: 'https://testproduct.com'
		};

		await Product.query().insert(baseProduct);

		const id = 42;
		const newProductData = {
			name: 'PRODUCT PUT TEST',
			icon: 22,
			infourl: 'http://updatetest.up'
		};

		return request(server)
			.put(`/products/${id}`)
			.send(newProductData)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.then((res) => {
				const { body } = res;
				expect(body.result).to.equal(1);
			});
	});


	// -----------------
	// DELETE /products
	// -----------------
	it('Should delete a product by ID', async () => {
		const baseProduct = {
			name: 'DELETEPRODUCTTEST',
			icon: 32,
			infourl: 'https://deleteproduct.de'
		};

		await Product.query().insert(baseProduct);
		const id = 44;

		return request(server)
			.delete(`/products/${id}`)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.then((res) => {
				const { body } = res;
				expect(body.result).to.equal(1);
			});
	});
});
