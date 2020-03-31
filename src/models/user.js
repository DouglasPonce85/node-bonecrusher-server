/* eslint-disable global-require */

const { Model } = require('objection');
const { dbTables, customId } = require('../configs/consts');
const Product = require('./product');

class User extends Model {
	static get tableName() {
		return dbTables.USERS;
	}

	static get idColumn() {
		return customId;
	}

	static get relationMappings() {
		const Organization = require('./organization');
		return {
			organization: {
				relation: Model.BelongsToOneRelation,
				modelClass: Organization,
				join: {
					from: 'USERS.ORGANIZATION_ID',
					to: 'ORGANIZATIONS.ID'
				}
			},
			products: {
				relation: Model.ManyToManyRelation,
				modelClass: Product,
				join: {
					from: 'USERS.ID',
					through: {
						from: 'USERPRODUCTS.USER_ID',
						to: 'USERPRODUCTS.PRODUCT_ID'
					},
					to: 'PRODUCTS.ID'
				}
			}
		};
	}
}

module.exports = User;
