/* eslint-disable no-unused-expressions */
/* eslint-disable no-irregular-whitespace */
/* eslint-disable global-require */
/* eslint-disable no-undef */

const knex = require('..')();
const { expect } = require('chai');

const Organization = require('../../src/models/organization');
const Product = require('../../src/models/product');
const mockOrganizations = require('../../src/configs/mockData/organizations');
const mockProducts = require('../../src/configs/mockData/products');
const mockOrganizationProducts = require('../../src/configs/mockData/organizationProducts');


describe('Product Model Test', () => {
	before(async () => {
		Organization.knex(knex);

		// Creates schema
		await knex.migrate.latest();

		// Insert mock data
		await knex.batchInsert('ORGANIZATIONS', mockOrganizations);
		await knex.batchInsert('PRODUCTS', mockProducts);
		await knex.batchInsert('ORGANIZATIONPRODUCTS', mockOrganizationProducts);
	});

	after(async () => {
		await knex.destroy();
	});


	// -----------------
	// GET all products
	// -----------------
	it('Should get all organizations', async () => {
		const data = await Organization.query();
		expect(data.length).to.equal(2);
	});


	// --------------------------------
	// GET product by non-existent ID
	// --------------------------------
	it('Should be null for non-existent organization', async () => {
		const userOne = await Organization.query().findById(3);
		expect(userOne).to.be.undefined;
	});


	// -----------------------
	// POST new organization
	// -----------------------
	it('Should create a new product', async () => {
		const newOrganization = {
			NAME: 'TEST',
			CODE: 'TEST',
			CLUSTERID: '9',
			CRMSID: '9'
		};
		const expectedOrganization = {
			ID: 3,
			NAME: 'TEST',
			CODE: 'TEST',
			CLUSTERID: '9',
			CRMSID: '9'
		};

		const data = await Organization.query().insert(newOrganization);
		expect(data).to.deep.equal(expectedOrganization);
	});

	//PUT organization

	//PUT product for organization
	it('Should update a product for an organization', async () => {
		const organizationid = 1;
		const productid = 1;
		const enabled = false;
		const producturl = 'http://updateurltest.com';

		const [ before ] = await knex('ORGANIZATIONPRODUCTS')
													.where('organization_id', organizationid)
													.andWhere('product_id', productid)

		const result = await knex('ORGANIZATIONPRODUCTS')
													.where('organization_id', organizationid)
													.andWhere('product_id', productid)
													.update({ enabled, producturl });

		const [ after ] = await knex('ORGANIZATIONPRODUCTS')
													.where('organization_id', organizationid)
													.andWhere('product_id', productid)

		expect(before.PRODUCTURL).to.equal('https://iqvia.com/');
		expect(before.ENABLED).to.equal(1);
		expect(result).to.equal(1);
		expect(after.PRODUCTURL).to.equal(producturl);
		expect(after.ENABLED).to.equal(0);
	})
});
