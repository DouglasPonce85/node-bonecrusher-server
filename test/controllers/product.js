/* eslint-disable no-irregular-whitespace */
/* eslint-disable global-require */
/* eslint-disable no-undef */

const knex = require('..')();
const { expect } = require('chai');
const mock = require('mock-require');

const formatter = require('../../src/utils/formatter');
const mockUsers = require('../../src/configs/mockData/users');
const mockProducts = require('../../src/configs/mockData/products');
const mockUserProducts = require('../../src/configs/mockData/userProducts');
const mockOrganizations = require('../../src/configs/mockData/organizations');
const mockOrganizationProducts = require('../../src/configs/mockData/organizationProducts');
const Product = require('../../src/models/product');


describe('Product Controller Test', () => {
	let ProductController;

	before(async () => {
		mock('../../src/models', { Product });
		ProductController = require('../../src/controllers/product');
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
		mock.stopAll();
	});

	it('Should get all products', async () => {
		const req = null;
		const res = {
			sendCalledWith: '',
			send(arg) {
				this.sendCalledWith = arg;
			}
		};

		const formattedProducts = await formatter.changeKeysCase(mockProducts, false);
		const expectedResponse = {
			products: formattedProducts
		};

		await ProductController.getAllProducts(req, res);

		expect(res.sendCalledWith).to.deep.equal(expectedResponse);
	});

	it('Should get all products by user ID', async () => {
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

		await ProductController.getProductsByUserId(req, res);
		expect(res.sendCalledWith.products).to.deep.equal(expectedProducts);
	});


	it('Should get all products by organization ID', async () => {
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
		const formattedProducts = await formatter.changeKeysCase(mockProducts, false);
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

		await ProductController.getProductsByOrganizationId(req, res);
		expect(res.sendCalledWith.products).to.deep.equal(expectedProducts);
	});

	it('Should get a product by ID', async () => {
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
		const expectedProduct = [
			{
				id: 1,
				name: 'Hue',
				icon: 1,
				infourl: 'http://iqvia.com/'
			}
		];

		await ProductController.getProductById(req, res);
		expect(res.sendCalledWith.products).to.deep.equal(expectedProduct);
	});


	it('Should create a product with data sent on body', async () => {
		const req = {
			body: {
				name: 'PRODUCT INSERT TEST',
				icon: 22,
				infourl: 'http://testingproduct.pr'
			}
		};
		const expectedProduct = {
			id: 42,
			name: 'PRODUCT INSERT TEST',
			icon: 22,
			infourl: 'http://testingproduct.pr'
		};
		const res = {
			sendCalledWith: '',
			send(arg) {
				this.sendCalledWith = arg;
			}
		};

		await ProductController.create(req, res);
		expect(res.sendCalledWith).to.be.an('object');
		expect(res.sendCalledWith.product).to.deep.equal(expectedProduct);
		await Product.query().deleteById(42);
	});


	it('Should update a product by ID with data sent on body', async () => {
		const baseProduct = {
			name: 'TESTPRODUCT',
			icon: 32,
			infourl: 'https://testproduct.com'
		};
		const req = {
			params: {
				id: 43
			},
			body: {
				name: 'PRODUCT PUT TEST',
				icon: 22,
				infourl: 'http://updatetest.up'
			}
		};
		const expectedProduct = {
			id: 43,
			name: 'PRODUCT PUT TEST',
			icon: 22,
			infourl: 'http://updatetest.up'
		};

		const res = {
			sendCalledWith: '',
			send(arg) {
				this.sendCalledWith = arg;
			}
		};

		await Product.query().insert(baseProduct);


		await ProductController.updateProductById(req, res);
		const data = await Product.query().findById(req.params.id);
		const formattedData = await formatter.changeKeysCase(data, false);

		expect(res.sendCalledWith).to.be.an('object');
		expect(res.sendCalledWith.result).to.equal(1);
		expect(formattedData).to.deep.equal(expectedProduct);
	});


	it('Should delete a product by ID', async () => {
		const baseProduct = {
			name: 'DELETEPRODUCTTEST',
			icon: 32,
			infourl: 'https://deleteproduct.de'
		};
		const req = {
			params: {
				id: 43
			},
			body: {
				name: 'PRODUCT PUT TEST',
				icon: 22,
				infourl: 'http://updatetest.up'
			}
		};

		const res = {
			sendCalledWith: '',
			send(arg) {
				this.sendCalledWith = arg;
			}
		};

		await Product.query().insert(baseProduct);
		await ProductController.deleteProductById(req, res);

		expect(res.sendCalledWith).to.be.an('object');
		expect(res.sendCalledWith.result).to.equal(1);
	});
});
