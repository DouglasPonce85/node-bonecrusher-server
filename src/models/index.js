/* eslint-disable import/order */

const { Model } = require('objection');
const { getDbConfig } = require('../utils/helper');
const knex = require('knex')(getDbConfig());

const Product = require('./product');
const User = require('./user');
const Organization = require('./organization');
const Dataset = require('./dataset');

Model.knex(knex);

module.exports = {
	knex,
	Product,
	User,
	Organization,
	Dataset
};
