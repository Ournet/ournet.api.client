'use strict';

const debug = require('debug')('ournet-api-client');
// const utils = require('./utils');
const createApi = require('./api');
const createCache = require('./cache');
const internal = {};

module.exports = function createClient(options) {
	options = options || {};

	const api = createApi(options.api);
	const cache = createCache(options.cache);

	const client = {
		mutate: function(data) {
			const result = {};

			const query = 'mutation' + internal.formatQuery(data);
			debug('mutation', query);

			return api.query(query).then(body => {
				debug('body', body);

				if (body.data) {
					for (let dp in body.data) {
						result[dp] = body.data[dp];
					}
				}
				if (body.errors) {
					result.errors = body.errors;
				}
				return result;
			});
		},
		query: function(data) {
			const result = {};
			const queryData = {};
			var hasQueryData = false;

			for (let prop in data) {
				var key = internal.formatKey(data[prop]);
				var name = data[prop].name;
				var value = cache.get(name, key);
				if (value === null || value === undefined) {
					queryData[prop] = data[prop];
					queryData[prop].key = key;
					hasQueryData = true;
				} else {
					result[prop] = value;
					debug('got from cache', prop);
				}
			}

			if (hasQueryData) {
				const query = 'query' + internal.formatQuery(queryData);
				debug('query', query);

				return api.query(query).then(body => {
					debug('body', body);

					if (body.data) {
						for (let dp in body.data) {
							result[dp] = body.data[dp];
							if (!queryData[dp].required || result[dp] !== null) {
								cache.put(queryData[dp].name, queryData[dp].key, result[dp]);
								debug('put to cache', queryData[dp].name, queryData[dp].key);
							} else {
								debug('NO put to cache', queryData[dp].name, queryData[dp].key);
							}
						}
					}
					if (body.errors) {
						result.errors = body.errors;
					}
					return result;
				});
			}

			return Promise.resolve(result);
		},
		cache: {
			clear: function() {
				debug('clear cache');
				return cache.clear();
			},
			size: function() {
				return cache.size();
			}
		}
	};

	return client;
};

internal.formatQuery = function(data) {
	var query = '';
	// var variables = {};
	var q;
	var v;

	for (var prop in data) {
		q = data[prop].query;
		v = data[prop].variables;
		if (v) {
			// utils.assign(variables, v);
			for (var vn in v) {
				q = q.replace('$' + vn, JSON.stringify(v[vn]));
			}
		}
		query += prop + ':' + data[prop].name + q + ' ';
	}

	return ' {' + query + '}';
};

internal.formatKey = function(data) {
	var key = data.query + (data.variables && JSON.stringify(data.variables) || '');
	key = key.replace(/\s+/g, '').trim();

	return key;
};

// internal.getFromCache = function(data)
