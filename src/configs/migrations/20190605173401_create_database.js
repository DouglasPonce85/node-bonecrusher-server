/* eslint-disable arrow-body-style */
/* eslint-disable no-unused-vars */
/* eslint-disable func-names */

exports.up = function (knex, Promise) {
	return knex.schema.createTable('PRODUCTS', (table) => {
		table.increments('ID').primary();
		table.string('NAME', 80);
		table.integer('ICON');
		table.string('INFOURL', 255);
	})
		.then(() => {
			return knex.schema.createTable('ORGANIZATIONS', (table) => {
				table.increments('ID').primary();
				table.string('NAME', 80);
				table.string('CODE', 80);
				table.string('CLUSTERID', 45);
				table.string('CRMSID', 45);
			});
		})
		.then(() => {
			return knex.schema.createTable('USERS', (table) => {
				table.increments('ID').primary();
				table.integer('ORGANIZATION_ID');
				table.string('LOGIN', 80);
				table.string('FIRSTNAME', 80);
				table.string('LASTNAME', 80);
				table.integer('TYPE');
				table.foreign('ORGANIZATION_ID', 'FK_USERS_ORGANIZATIONS')
					.references('ID')
					.inTable('ORGANIZATIONS')
					.onDelete('CASCADE');

			});
		})
		.then(() => {
			return knex.schema.createTable('DATASETS', (table) => {
				table.increments('ID').primary();
				table.integer('ORGANIZATION_ID');
				table.foreign('ORGANIZATION_ID', 'FK_DATASETS_ORGANIZATIONS')
					.references('ID')
					.inTable('ORGANIZATIONS')
					.onDelete('CASCADE');

				table.string('NAME', 80);
				table.string('CODE', 80);
				table.string('SOURCE', 80);
				table.string('DESCRIPTION', 80);
				table.timestamp('LASTUPDATED').defaultTo(knex.fn.now());
			});
		})
		.then(() => {
			return knex.schema.createTable('USERPRODUCTS', (table) => {
				table.integer('USER_ID');
				table.foreign('USER_ID', 'FK_UP_USERS')
					.references('ID')
					.inTable('USERS')
					.onDelete('CASCADE');

				table.integer('PRODUCT_ID');
				table.foreign('PRODUCT_ID', 'FK_UP_PRODUCTS')
					.references('ID')
					.inTable('PRODUCTS')
					.onDelete('CASCADE');

				table.integer('ENABLED', 3);
			});
		})
		.then(() => {
			return knex.schema.createTable('ORGANIZATIONPRODUCTS', (table) => {
				table.integer('ORGANIZATION_ID');
				table.foreign('ORGANIZATION_ID', 'FK_OP_ORGANIZATIONS')
					.references('ID')
					.inTable('ORGANIZATIONS')
					.onDelete('CASCADE');

				table.integer('PRODUCT_ID');
				table.foreign('PRODUCT_ID', 'FK_OP_PRODUCTS')
					.references('ID')
					.inTable('PRODUCTS')
					.onDelete('CASCADE');

				table.integer('ENABLED', 3);
				table.string('PRODUCTURL', 255);
			});
		})
		.then(() => {
			console.log('CREATED DATABASE');
		})
		.catch((err) => {
			console.log(`MIGRATIONS ERROR: ${err}`);
		});
};

exports.down = function (knex, Promise) {
	return knex.schema.table('ORGANIZATIONPRODUCTS', (table) => {
		table.dropForeign('ORGANIZATION_ID', 'FK_OP_ORGANIZATIONS');
		table.dropForeign('PRODUCT_ID', 'FK_OP_PRODUCTS');
	})
		.then(() => {
			return knex.schema.table('USERPRODUCTS', (table) => {
				table.dropForeign('USER_ID', 'FK_UP_USERS');
				table.dropForeign('PRODUCT_ID', 'FK_UP_PRODUCTS');
			});
		})
		.then(() => {
			return knex.schema.table('DATASETS', (table) => {
				table.dropForeign('ORGANIZATION_ID', 'FK_DATASETS_ORGANIZATIONS');
			});
		})
		.then(() => {
			return knex.schema.table('USERS', (table) => {
				table.dropForeign('ORGANIZATION_ID', 'FK_USERS_ORGANIZATIONS');
			});
		})
		.then(() => {
			return knex.schema.dropTable('ORGANIZATIONPRODUCTS');
		})
		.then(() => {
			return knex.schema.dropTable('USERPRODUCTS');
		})
		.then(() => {
			return knex.schema.dropTable('DATASETS');
		})
		.then(() => {
			return knex.schema.dropTable('ORGANIZATIONS');
		})
		.then(() => {
			return knex.schema.dropTable('USERS');
		})
		.then(() => {
			return knex.schema.dropTable('PRODUCTS');
		})
		.then(() => {
			return knex.raw(`
        BEGIN
          FOR cur_rec IN (SELECT object_name, object_type
                            FROM user_objects
                            WHERE object_type = 'SEQUENCE'
                            AND object_name not like 'migrations%')
          LOOP
            BEGIN
                EXECUTE IMMEDIATE    'DROP '
                                  || cur_rec.object_type
                                  || ' "'
                                  || cur_rec.object_name
                                  || '"';
            EXCEPTION
                WHEN OTHERS
                THEN
                  DBMS_OUTPUT.put_line (   'FAILED: DROP '
                                        || cur_rec.object_type
                                        || ' "'
                                        || cur_rec.object_name
                                        || '"'
                                        );
            END;
          END LOOP;
      END;
    `);
		})
		.then(() => {
			console.log('ROLLBACK DONE!');
		})
		.catch((err) => {
			console.log(`ROLLBACK ERROR: ${err}`);
		});
};
