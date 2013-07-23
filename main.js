/*jslint node:true, bitwise: true, unparam: true, maxerr: 50, white: true, nomen: true */
/*!
 * crafity-nodemanager - Manage multiple node instances
 * Copyright(c) 2011 Crafity
 * Copyright(c) 2011 Bart Riemens
 * Copyright(c) 2012 Galina Slavova
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
exports.version = '0.1.1';

exports.createServer = function (config) {
	return new Server(config);
};

exports.createClient = function (config) {
	return new Client(config);
};
