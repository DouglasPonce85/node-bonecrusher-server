const express = require('express');
const controller = require('../../controllers/organization');

const organizations = express.Router();

//
// ------------------
//  SWAGGER.SUMMARY
// ------------------
// 1. [ GET ]     /organizations 		  		   			  		  :: Lists all organizations
// 2. [ POST ]    /organizations 		  		   			  		  :: Adds a new organization
// 3. [ GET ]     /organizations/:id 	  		   			  		  :: Finds organization by ID
// 4. [ PUT ]  	  /organizations/:id 	  		   			  		  :: Updates organization by ID
// 5. [ DELETE ]  /organizations/:id 	  		   			  		  :: Deletes an exiting organization by ID
// 6. [ PUT ]  	  /organizations/:organizationid/products/:productid  :: Updates product for an organization
//


organizations.route('/organizations')
	.get(controller.getAllOrganizations);

organizations.route('/organizations')
	.post(controller.create);


organizations.route('/organizations/:id')
	.get(controller.getOrganizationById);

organizations.route('/organizations/:id')
	.put(controller.updateOrganizationById);

organizations.route('/organizations/:id')
	.delete(controller.deleteOrganizationById);


organizations.route('/organizations/:organizationid/product/:productid')
	.put(controller.updateProductForOrganization);

module.exports = organizations;
