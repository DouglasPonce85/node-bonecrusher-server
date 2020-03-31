const { knex, Organization, Product, User } = require('../models');
const formatter = require('../utils/formatter');
const queryBuilder = require('../utils/queryBuilder');
const helper = require('../utils/helper');

module.exports = {
	create: async (req, res, next) => {
		try {
			const data = await Organization.query().insert(req.body);
			const formattedData = await formatter.changeKeysCase(data, false);
			res.send({ organization: formattedData });
		} catch (err) {
			helper.controllerErrorRaised('create', err, next);
		}
	},

	getAllOrganizations: async (req, res, next) => {
		try {
			const data = await Organization.query();
			const formattedData = await formatter.changeKeysCase(data, false);
			res.send({ organizations: formattedData });
		} catch (err) {
			helper.controllerErrorRaised('getAllOrganizations', err, next);
		}
	},

	getOrganizationById: async (req, res, next) => {
		try {
			const { id } = req.params;
			if (!id) res.send({ });

			const data = await Organization.query().findById(id);
			const formattedData = await formatter.changeKeysCase(data, false);
			res.send({ organization: formattedData });
		} catch (err) {
			helper.controllerErrorRaised('getOrganizationById', err, next);
		}
	},

	updateOrganizationById: async (req, res, next) => {
		try {
			const organizationUpdated = await queryBuilder.modelUpdateById(Organization, req, res, next);
			if (!organizationUpdated) {
				helper.rowNotUpdatedValidation(Organization, req, res);
				return;
			}
			res.send(organizationUpdated);
		} catch (err) {
			helper.controllerErrorRaised('updateOrganizationById', err, next);
		}
	},

	updateProductForOrganization: async (req, res, next) => {
		try {
			const { 
				params: {
					organizationid, 
					productid
				},
				body: {
					enabled,
					producturl
				} 
			} = req;

			const result = await knex('ORGANIZATIONPRODUCTS')
											.where('organization_id', organizationid)
											.andWhere('product_id', productid)
											.update({ enabled, producturl })


			res.send({ result });
		} catch (err) {
			helper.controllerErrorRaised('updateProductForOrganization', err, next);
		}
	},
	deleteOrganizationById: async (req, res, next) => {
		try {
			const { id } = req.params;
			const [ { USERS } ] = await User.query().count('* as users').where('organization_id', id);

			if (USERS) throw new Error('Cant delete an organization with users');

			await queryBuilder.modelDeleteById(Organization, req, res, next);
		} catch (err) {
			helper.controllerErrorRaised('deleteOrganizationById', err, next);
		}
	}
};
