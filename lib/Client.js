module.exports = function Client(config) {
	var http = require('http');

	this.registerProcesses = function (processes, callback) {
		post(
			config.host,
			config.port,
			'/processes/register',
			[].concat(processes),
			callback);
	};

	this.getProcesses = function (callback) {
		get(
			config.host,
			config.port,
			'/processes',
			callback);
	};

	this.getProcess = function (name, callback) {
		get(
			config.host,
			config.port,
			encodeURI('/processes/' + name),
			callback);
	};

	this.invoke = function (process, action, callback) {
		get(
			config.host,
			config.port,
			encodeURI('/processes/' + process.name + "/" + action),
			callback);
	};

	function get(host, port, path, callback) {
		var options = {
			host: host,
			port: port,
			path: path,
			method: 'GET'
		};
		callback = callback || function () {
		};

		var req = http.request(options, function(res) {
			var result = "";
			res.setEncoding('utf8');
			res.on('data', function (data) {
				result += data.toString();
			});
			res.on('end', function () {
				if (res.statusCode === 200) {
					callback(null, result ? JSON.parse(result) : undefined);
				} else {
					callback(new Error(result));
				}
			});
		});
		req.end();
	}

	function post(host, port, path, data, callback) {
		var options = {
			host: host,
			port: port,
			path: path,
			method: 'POST'
		};
		callback = callback || function () {
		};

		var req = http.request(options, function(res) {
			var result = "";
			res.setEncoding('utf8');
			res.on('data', function (data) {
				result += data.toString();
			});
			res.on('end', function () {
				if (res.statusCode === 200) {
					callback(null, result ? JSON.parse(result) : undefined);
				} else {
					callback(new Error(result));
				}
			});
		});
		req.write(JSON.stringify(data));
		req.end();
	}
};
