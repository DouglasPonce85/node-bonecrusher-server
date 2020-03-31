/* eslint-disable global-require */

const { Model } = require('objection');
const { dbTables, customId } = require('../configs/consts');

class Product extends Model {
	static get tableName() {
		return dbTables.PRODUCTS;
	}

	static get idColumn() {
		return customId;
	}

	$parseDatabaseJson(json) {

		json = super.$parseDatabaseJson(json);

		if (typeof json.ENABLED !== 'undefined') {
			json.ENABLED = !!json.ENABLED;
		}

		return json;
	}

	static get relationMappings() {
		const User = require('./user');
		const Organization = require('./organization');

		return {
			users: {
				relation: Model.ManyToManyRelation,
				modelClass: User,
				join: {
					from: 'PRODUCTS.ID',
					through: {
						from: 'USERPRODUCTS.PRODUCT_ID',
						to: 'USERPRODUCTS.USER_ID'
					},
					to: 'USERS.ID'
				}
			},
			organizations: {
				relation: Model.ManyToManyRelation,
				modelClass: Organization,
				join: {
					from: 'PRODUCTS.ID',
					through: {
						from: 'ORGANIZATIONPRODUCTS.PRODUCT_ID',
						to: 'ORGANIZATIONPRODUCTS.ORGANIZATION_ID'
					},
					to: 'ORGANIZATIONS.ID'
				}
			}
		};
	}
}

module.exports = Product;
