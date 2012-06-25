var Server = require('./Server')
	, Client = require('./Client');

exports.createServer = function (config) {
	return new Server(config);
};

exports.createClient = function (config) {
	return new Client(config);
};