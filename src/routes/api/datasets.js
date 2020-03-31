const express = require('express');
const controller = require('../../controllers/dataset');

const datasets = express.Router();

//
// ------------------
//  SWAGGER.SUMMARY
// ------------------
// 1. [ GET ]     /datasets 		  		  :: Lists all datasets
// 2. [ POST ]    /datasets 		  		  :: Adds a new dataset
// 3. [ GET ]     /datasets/:id 	  		  :: Finds dataset by ID
// 4. [ PUT ]  	  /datasets/:id 	  		  :: Updates dataset by ID
// 5. [ DELETE ]  /datasets/:id 	  		  :: Deletes an exiting dataset by ID
// 6. [ GET ]  	  /datasets/organization/:id  :: Finds dataset by organization ID
// 7. [ PUT ]  	  /datasets/:ocode/:dcode	  :: Updates lastupdated field for a dataset by Code
//


datasets.route('/datasets')
	.get(controller.getAllDatasets);

datasets.route('/datasets')
	.post(controller.create);


datasets.route('/datasets/:id')
	.get(controller.getDatasetById);

datasets.route('/datasets/:id')
	.put(controller.updateDatasetById);

datasets.route('/datasets/:id')
	.delete(controller.deleteDatasetById);


datasets.route('/datasets/organization/:id')
	.get(controller.getDatasetsByOrganizationId);

datasets.route('/datasets/:ocode/:dcode')
	.put(controller.updateLastUpdated);

module.exports = datasets;
