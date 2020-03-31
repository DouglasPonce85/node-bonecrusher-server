/* eslint-disable arrow-body-style */
/* eslint-disable no-unused-vars */
/* eslint-disable func-names */

const organizations = require('../mockData/organizations');
const users = require('../mockData/users');
const products = require('../mockData/products');
const datasets = require('../mockData/datasets');
const organizationProducts = require('../mockData/organizationProducts');
const userProducts = require('../mockData/userProducts');

exports.seed = function (knex, Promise) {
	// Deletes ALL existing entries
	return knex('ORGANIZATIONS').del()
		.then(() => {
			// Inserts seed entries
			return knex('ORGANIZATIONS').insert(organizations);
		})
		.then(() => {
			return knex('USERS').del();
		})
		.then(() => {
			// Inserts seed entries
			return knex('USERS').insert(users);
		})
		.then(() => {
			return knex('PRODUCTS').del();
		})
		.then(() => {
			// Inserts seed entries
			return knex('PRODUCTS').insert(products);
		})
		.then(() => {
			return knex('DATASETS').del();
		})
		.then(() => {
			// Inserts seed entries
			return knex('DATASETS').insert(datasets);
		})
		.then(() => {
			return knex('ORGANIZATIONPRODUCTS').del();
		})
		.then(() => {
			return knex('ORGANIZATIONPRODUCTS').insert(organizationProducts);
		})
		.then(() => {
			return knex('USERPRODUCTS').del();
		})
		.then(() => {
			return knex('USERPRODUCTS').insert(userProducts);
		});
};
