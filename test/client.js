'use strict';

const client = require('../lib').create();
const assert = require('assert');

describe('client', function() {
	it('should get geo place', function() {
		return client.query({
				place: {
					name: 'places_place',
					query: '(id:$placeId){id name}',
					variables: { placeId: 685948 }
				}
			})
			.then(result => {
				assert.ok(result.place);
				assert.equal(685948, result.place.id);
			});
	});

	it('should get geo place with region', function() {
		return client.query({
				place: {
					name: 'places_place',
					query: '(id:$placeId){id name region{id name}}',
					variables: { placeId: 685948 }
				}
			})
			.then(result => {
				assert.ok(result.place);
				assert.ok(result.place.region);
				assert.equal(685948, result.place.id);
			});
	});
});
