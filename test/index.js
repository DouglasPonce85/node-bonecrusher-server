/* eslint-disable no-irregular-whitespace */
/* eslint-disable global-require */

process.env.NODE_ENV = 'TEST';
/**
 *  Generates a new instance of knex connection each time the connection is destroyed
 *  and the in-memory database is wiped for testing purposes.
 */

const knex = () => require('knex')({
	client: 'sqlite',
	useNullAsDefault: true,
	connection: ':memory:',
	migrations: {
		tableName: 'migrations',
		directory: 'src/configs/migrations'
	}
});

module.exports = knex;
