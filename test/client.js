'use strict';

// process.env.OURNET_API_HOST = 'localhost:41702';

const client = require('../lib').create({ cache: { places_place: { ttl: 1000 * 60 * 1, max: 100 } } });
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

	it('should get geo place from cache', function() {
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

	it('should NOT put to cache', function() {
		return client.query({
				place: {
					name: 'places_place',
					query: '(id:$placeId){id name}',
					variables: { placeId: 99999999 },
					required: false
				}
			})
			.then(result => {
				assert.equal(null, result.place);
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

	it('should mutate storyView', function() {
		return client.mutate({
				story: {
					name: 'stories_viewStory',
					query: '(id:$id){id countViews}',
					variables: { id: 364496 }
				}
			})
			.then(result => {
				// console.log(result);
				assert.ok(result.story);
				assert.equal(364496, result.story.id);
			});
	});
});
