const { knex, User } = require('../models');

const queryBuilder = require('../utils/queryBuilder');
const formatter = require('../utils/formatter');
const helper = require('../utils/helper');
const consts = require('../configs/consts');

module.exports = {
	create: async (req, res, next) => {
		try {
			const usercheck = await User.query().where('login', req.body.login);

			if (usercheck.length > 1) throw new Error('A user has already been registered with this email.');

			const data = await User.query().insert(req.body);
			const formattedData = await formatter.changeKeysCase(data, false);
			res.send({ user: formattedData });
		} catch (err) {
			helper.controllerErrorRaised('create', err, next);
		}
	},

	getAllUsers: async (req, res, next) => {
		try {
			const data = await User.query();
			const formattedData = await formatter.changeKeysCase(data, false);
			res.send({ users: formattedData });
		} catch (err) {
			helper.controllerErrorRaised('getAllUsers', err, next);
		}
	},

	getUserById: async (req, res, next) => {
		try {
			const { id } = req.params;
			if (!id) res.send({});

			const data = await User.query().findById(id);
			const formattedData = await formatter.changeKeysCase(data, false);
			res.send({ users: [formattedData] });
		} catch (err) {
			helper.controllerErrorRaised('getUserById', err, next);
		}
	},

	getUsersByOrganizationId: async (req, res, next) => {
		try {
			const { id } = req.params;
			if (!id) res.send({});

			const data = await User.query().select('u.*','o.id as organization_id','o.name','o.code','o.clusterid','o.crmsid')
				.from('users as u')
				.joinRelation('organization as o')
				.where('o.id', '=', id);
			const formattedData = await formatter.changeKeysCase(data, false);
			res.send({ users: formattedData });
		} catch (err) {
			helper.controllerErrorRaised('getUsersByOrganizationId', err, next);
		}
	},

	updateUserById: async (req, res, next) => {
		try {
			const userUpdated = await queryBuilder.modelUpdateById(User, req, res, next);
			if (!userUpdated) {
				helper.rowNotUpdatedValidation(User, req, res);
				return;
			}
			res.send(userUpdated);
		} catch (err) {
			helper.controllerErrorRaised('updateUserById', err, next);
		}
	},

	updateProductForUser: async (req, res, next) => {
		try {
			const { 
				params: {
					userid, 
					productid
				},
				body: {
					enabled
				} 
			} = req;

			const result = await knex('USERPRODUCTS')
											.where('user_id', userid)
											.andWhere('product_id', productid)
											.update({ enabled })


			res.send({ result });
		} catch (err) {
			helper.controllerErrorRaised('updateProductForOrganization', err, next);
		}
	},

	deleteUserById: async (req, res, next) => {
		try {
			await queryBuilder.modelDeleteById(User, req, res, next);
		} catch (err) {
			helper.controllerErrorRaised('deleteUserById', err, next);
		}
	}
};
