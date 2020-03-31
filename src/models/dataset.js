/* eslint-disable global-require */

const { Model } = require('objection');
const { dbTables, customId } = require('../configs/consts');

class Dataset extends Model {
	static get tableName() {
		return dbTables.DATASETS;
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
					from: 'DATASETS.ORGANIZATION_ID',
					to: 'ORGANIZATIONS.ID'
				}
			}
		};
	}
}

module.exports = Dataset;
