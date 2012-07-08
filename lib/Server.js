module.exports = function Server(config) {
	var app = require('crafity-webserver')
		, core = require('crafity-core')
		, processManager = require('crafity-process').init(config)
		, logger = require('crafity-logging');

	if (config.logging && config.logging.appenders) {
		processManager.onNewProcess.subscribe(function (process) {
			process.setLogger(logger.create(process.info.name, process.info.name, core.objects.clone(config.logging)));
		});
	}
	
	this.listen = function (callback) {
		callback = callback || function (err) {
			if (err) { throw new err; }
		};

		app.createServer(config, function (err, app) {
			if (err) { return callback(err); }

			app.onconfigure(function (app) {
				app.get("/?", function (req, res) {
					res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
					res.end(JSON.stringify({ "name": "node-manager", "version": "0.0.1"}));
				});

				app.get("/processes", function (req, res) {
					res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
					res.end(JSON.stringify(processManager.getProcesses().map(function (process) { return process.info; })));
				});

				app.post("/processes/register", function (req, res) {
					req.on('data', function (data) {
						processManager.registerProcesses(JSON.parse(data));
						res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
						res.end(JSON.stringify(processManager.getProcesses().map(function (process) { return process.info; })));
					});
				});

				app.get("/processes/:name", function (req, res) {
					try {
						var result = JSON.stringify(processManager.getProcess(req.params.name).info);
						res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
						res.end(result);
					} catch(err) {
						res.writeHead(500, { 'Content-Type': 'text/plain' });
						res.end(err.message);
					}
				});

				app.get("/processes/:name/:action", function (req, res) {
					var process = processManager.getProcess(req.params.name)
						, action = req.params.action
						, timeout;

					try {
						if (!process.commands[action]) {
							res.writeHead(500, { 'Content-Type': 'text/plain' });
							return res.end("Unable to invoke unknown action '" + action + "'");
						}

						timeout = setTimeout(function safetynet() {
							if (!timeout) { return; }
							timeout = undefined;
							res.writeHead(500, { 'Content-Type': 'text/plain' });
							return res.end("Action timed out");
						}, 30000);

						process.commands[action](function (err) {
							clearTimeout(timeout);
							if (!timeout) { return; }
							timeout = undefined;
							if (err) {
								res.writeHead(500, { 'Content-Type': 'text/plain' });
								return res.end(err.message);
							} else {
								res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
								return res.end(JSON.stringify(processManager.getProcess(req.params.name).info));
							}
						});
					} catch (err) {
						clearTimeout(timeout);
						if (!timeout) { return; }
						timeout = undefined;
						console.log("err", err.stack, err);
						res.writeHead(500, { 'Content-Type': 'text/plain' });
						return res.end("Error invoking action '" + action + "'");
					}
				});

				app.onlistening(function () {
					processManager.registerProcesses(app.config.processes, callback); 
				});
			});
		});
	};
};
