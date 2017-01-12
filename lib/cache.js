'use strict';

const storage = require('memory-cache');
const utils = require('./utils');
const DEFAULT_TTL = 60 * 2;
const OPTIONS = {
	weather_report: {
		ttl: 60 * 10
	}
};

module.exports = function createCache(options) {
	options = options || {};

	options = utils.defaults(options, OPTIONS);

	const cache = {
		get: function(name, key) {
			return storage.get(name + ':' + key);
		},
		put: function(name, key, value, ttl) {
			key = name + ':' + key;
			storage.put(key, value, (ttl || options[name] || DEFAULT_TTL) * 1000);
		}
	};

	return cache;
};
