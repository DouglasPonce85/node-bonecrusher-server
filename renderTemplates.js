const express = require('express');
const path = require('path');

const { pathBootstrap } = require('./src/configs/consts');
const { pathJQuery } = require('./src/configs/consts');

module.exports = {
	renderTemplates: (app, render) => {
		if (!app || !render) return;

		app.use(express.static(path.join(__dirname, 'public')));
		app.use('/css', express.static(path.join(__dirname, pathBootstrap, 'css')));
		app.use('/js', express.static(path.join(__dirname, pathBootstrap, 'js')));
		app.use('/js', express.static(path.join(__dirname, pathJQuery)));
		app.set('views', './src/views');
		app.set('view engine', 'ejs');
	}
};
