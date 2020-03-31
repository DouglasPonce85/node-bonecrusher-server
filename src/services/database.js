const { knex } = require('../models');

function fetchAll(tableName) {
	return new Promise(async (resolve, reject) => {
		knex.from(tableName).select()
			.then((rows) => { resolve(rows); })
			.catch((err) => {
				console.log('Error @ fetchAll()... ');
				reject(err);
			});
	});
}

async function closeDB() {
	await knex.destroy();
}

module.exports = {
	fetchAll,
	closeDB
};
