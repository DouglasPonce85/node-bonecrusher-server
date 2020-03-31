const express = require('express');
const controller = require('../../controllers/configuration');

const config = express.Router();

config.route('/configuration')
	.get(controller.getUserInfo);



module.exports = config;