/*jslint node:true, unparam: true, maxerr: 50, white: true */
"use strict";
/*!
 * crafity-nodemanager - Manage multiple node instances
 * Copyright(c) 2013 Crafity
 * Copyright(c) 2013 Bart Riemens
 * Copyright(c) 2013 Galina Slavova
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var Server = require('./lib/Server')
	, Client = require('./lib/Client');

/**
 * Framework name.
 */
exports.fullname = 'crafity-nodemanager';

/**
 * Framework version.
 */
exports.version = '0.1.5';

exports.createServer = function (config) {
	return new Server(config);
};

exports.createClient = function (config) {
	return new Client(config);
};
