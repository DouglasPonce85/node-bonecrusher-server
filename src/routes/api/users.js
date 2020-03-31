const express = require('express');
const controller = require('../../controllers/user');

const users = express.Router();

//
// ------------------
//  SWAGGER.SUMMARY
// ------------------
// 1. [ GET ]     /users 		  		   			  :: List all products
// 2. [ POST ]    /users 		  		   			  :: Adds a new user
// 3. [ GET ]     /users/:id 	  		   			  :: Finds user by ID
// 4. [ PUT ]  	  /users/:id 	  		   			  :: Updates user by ID
// 5. [ DELETE ]  /users/:id 	  		   			  :: Deletes an exiting user by ID
// 6. [ GET ]  	  /users/organization/:id  		  	  :: Finds user by organization ID
// 7. [ PUT ]  	  /users/:userid/products/:productid  :: Updates product for user
//


users.route('/users')
	.get(controller.getAllUsers);

users.route('/users')
	.post(controller.create);


users.route('/users/:id')
	.get(controller.getUserById);

users.route('/users/:id')
	.put(controller.updateUserById);

users.route('/users/:id')
	.delete(controller.deleteUserById);


users.route('/users/organization/:id')
	.get(controller.getUsersByOrganizationId);

users.route('/users/:userid/products/:productid')
	.put(controller.updateProductForUser);

module.exports = users;
