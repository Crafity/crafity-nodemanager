/*jslint node: true, white: true */
"use strict";

/*!
 * crafity-nodemanager - Node Manager
 * Copyright(c) 2010-2013 Crafity
 * Copyright(c) 2010-2013 Bart Riemens
 * Copyright(c) 2010-2013 Galina Slavova
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var http = require('http')
  , version = process.versions.node.split('.')
  ;

function get(host, port, path, callback) {
  var req
    , options = {
      host: host,
      port: port,
      path: path,
      method: 'GET'
    };
  callback = callback || function () {
    return false;
  };

  req = http.request(options, function (res) {
    var result = "";
    res.setEncoding('utf8');
    res.on('data', function (data) {
      result += data.toString();
    });
    res.on("end", function () {
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
  var req
    , buffer = JSON.stringify(data)
    , options = {
      host: host,
      port: port,
      path: path,
      method: 'POST'
    };
  callback = callback || function () {
    return false;
  };
  req = http.request(options, function (res) {
    var result = "";
    res.setEncoding('utf8');
    res.on('data', function (data) {
      result += data.toString();
    });
    res.on('end', function () {
      if (res.statusCode === 200) {
        callback(null, result && JSON.parse(result));
      } else {
        callback(new Error(result));
      }
    });
  });
  req.setHeader("content-type", "application/json");
  req.setHeader('content-length', buffer.length);
  req.end(buffer);
}

module.exports = function Client(config) {

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

  this.registerProcesses(config.processes, function (err) {
    if (err) { throw err; }
  });
  
};
