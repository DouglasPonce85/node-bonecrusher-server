const { Model } = require('objection');

const Dataset = require('./dataset');
const Product = require('./product');
const User = require('./user');

const { dbTables, customId } = require('../configs/consts');

class Organization extends Model {
	static get tableName() {
		return dbTables.ORGANIZATIONS;
	}

	static get idColumn() {
		return customId;
	}

	static get relationMappings() {
		return {
			datasets: {
				relation: Model.HasManyRelation,
				modelClass: Dataset,
				join: {
					from: 'ORGANIZATIONS.ID',
					to: 'DATASETS.ORGANIZATION_ID'
				}
			},
			users: {
				relation: Model.HasManyRelation,
				modelClass: User,
				join: {
					from: 'ORGANIZATIONS.ID',
					to: 'USERS.ORGANIZATION_ID'
				}
			},
			products: {
				relation: Model.ManyToManyRelation,
				modelClass: Product,
				join: {
					from: 'ORGANIZATIONS.ID',
					through: {
						from: 'ORGANIZATIONPRODUCTS.PRODUCT_ID',
						to: 'ORGANIZATIONPRODUCTS.ORGANIZATION_ID'
					},
					to: 'PRODUCTS.ID'
				}
			}
		};
	}
}

module.exports = Organization;
