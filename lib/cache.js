'use strict';

const debug = require('debug')('ournet-api-client');
const createLRU = require('lru-cache');
const utils = require('./utils');
const CACHE = {};

function getStorage(name, options) {
	if (!CACHE[name]) {
		// no cache
		if (!options) {
			debug('no cache for ' + name);
			return null;
		}
		if (!options.max || !options.ttl) {
			throw new Error('Invalid cache options');
		}
		CACHE[name] = createLRU({ max: options.max, maxAge: options.ttl });
	}
	return CACHE[name];
}

module.exports = function createCache(options) {
	options = options || {};

	const cache = {
		get: function(name, key) {
			var storage = getStorage(name, options[name]);
			if (storage) {
				return storage.get(key);
			}
			return undefined;
		},
		put: function(name, key, value, ttl) {
			var storage = getStorage(name, options[name]);
			if (storage) {
				if (utils.isNumber(ttl)) {
					if (ttl > 0) {
						storage.set(key, value, ttl);
					}
				} else {
					storage.set(key, value);
				}
			}
		},
		clear: function(name) {
			if (name) {
				var storage = getStorage(name, options[name]);
				return storage && storage.reset();
			} else {
				for (var prop in CACHE) {
					CACHE[prop].reset();
				}
			}
		},
		size: function(name) {
			var storage = getStorage(name, options[name]);
			return storage && storage.length;
		}
	};

	return cache;
};
