/* eslint-disable no-restricted-globals */
const { Product } = require('../models');

const queryBuilder = require('../utils/queryBuilder');
const helper = require('../utils/helper');
const formatter = require('../utils/formatter');
const consts = require('../configs/consts');

module.exports = {
	create: async (req, res, next) => {
		try {
			const data = await Product.query().insert(req.body);
			const formattedData = await formatter.changeKeysCase(data, false);
			res.send({ product: formattedData });
		} catch (err) {
			helper.controllerErrorRaised('create', err, next);
		}
	},

	getAllProducts: async (req, res, next) => {
		try {
			const data = await Product.query();
			const formattedData = await formatter.changeKeysCase(data, false);
			res.send({ products: formattedData });
		} catch (err) {
			helper.controllerErrorRaised('getAllProducts', err, next);
		}
	},

	getProductById: async (req, res, next) => {
		try {
			const { id } = req.params;
			if (!id) res.send({});

			const data = await Product.query().findById(id);
			const formattedData = await formatter.changeKeysCase(data, false);
			res.send({ products: [formattedData] });
		} catch (err) {
			helper.controllerErrorRaised('getProductById', err, next);
		}
	},

	getProductsByUserId: async (req, res, next) => {
		try {
			const { id } = req.params;
			const data = await Product.query()
				.select(['products.*', 'u.*', 'up.*', 'op.*'])
				.innerJoin('USERPRODUCTS as up', 'up.product_id', 'products.id')
				.innerJoin('USERS as u', 'u.id', 'up.user_id')
				.innerJoin('ORGANIZATIONPRODUCTS as op', 'op.product_id', 'up.product_id')
				.where('up.user_id', '=', id);

			const formattedData = await formatter.changeKeysCase(data, false);
			res.send({ products: formattedData });
		} catch (err) {
			helper.controllerErrorRaised('getProductsByUserId', err, next);
		}
	},

	getProductsByOrganizationId: async (req, res, next) => {
		try {
			const { id } = req.params;
			const data = await Product.query()
				.select('p.*','op.*','o.id as organization_id','o.name','o.code','o.clusterid','o.crmsid')
				.from('products as p')
				.leftJoin('organizationproducts as op', 'p.id', 'op.product_id')
				.leftJoin('organizations as o', 'op.organization_id', 'o.id')
				.where('o.id', '=', id);
			const formattedData = await formatter.changeKeysCase(data, false);
			res.send({ products: formattedData });
		} catch (err) {
			helper.controllerErrorRaised('getProductsByOrganizationId', err, next);
		}
	},

	updateProductById: async (req, res, next) => {
		try {
			const { params: { id }, body } = req;
			const result = await Product.query().findById(id).patch(body);
			res.send({ result });
		} catch (err) {
			helper.controllerErrorRaised('updateProductById', err, next);
		}
	},

	deleteProductById: async (req, res, next) => {
		try {
			await queryBuilder.modelDeleteById(Product, req, res, next);
		} catch (err) {
			helper.controllerErrorRaised('deleteProductById', err, next);
		}
	}
};
