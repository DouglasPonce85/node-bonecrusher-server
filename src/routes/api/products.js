const express = require('express');
const controller = require('../../controllers/product');

const products = express.Router();

//
// ------------------
//  SWAGGER.SUMMARY
// ------------------
// 1. [ GET ]     /products 		  		  :: List all products
// 2. [ POST ]    /products 		  		  :: Adds a new product
// 3. [ GET ]     /products/:id 	  		  :: Find product by ID
// 4. [ PUT ]  	  /products/:id 	  		  :: Updates an existing product
// 5. [ DELETE ]  /products/:id 	  		  :: Deletes an existing product
// 6. [ GET ]  	  /products/user/:id  		  :: Find product by user ID
// 7. [ GET ]  	  /products/organization/:id  :: Find product by organization ID
//


products.route('/products')
	.get(controller.getAllProducts);

products.route('/products')
	.post(controller.create);


products.route('/products/:id')
	.get(controller.getProductById);

products.route('/products/:id')
	.put(controller.updateProductById);

products.route('/products/:id')
	.delete(controller.deleteProductById);


products.route('/products/user/:id')
	.get(controller.getProductsByUserId);

products.route('/products/organization/:id')
	.get(controller.getProductsByOrganizationId);

module.exports = products;
