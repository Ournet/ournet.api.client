'use strict';

const request = require('request');
const utils = require('./utils');
const Promise = utils.Promise;
const OPTIONS = {
	host: process.env.OURNET_API_HOST || 'ournetapi.com',
	schema: 'http',
	timeout: 10 * 1000,
	gzip: true
};

function callApi(options, query, variables) {
	return new Promise((resolve, reject) => {
		request({
			method: 'POST',
			url: options.schema + '://' + options.host + '/graphql',
			body: { query: query, variables: variables },
			json: true,
			headers: options.headers,
			timeout: options.timeout,
			gzip: options.gzip
		}, function(error, response, body) {
			if (error) {
				return reject(error);
			}
			resolve(body);
		});
	});
}

module.exports = function createApi(options) {
	options = options || {};
	options = utils.defaults(options, OPTIONS);

	const api = {
		query: function(query, variables) {
			return callApi(options, query, variables);
		}
	};

	return api;
};
