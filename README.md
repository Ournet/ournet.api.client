# ournet.api.client

## API

### create(options)

Creates an Api Client

Example:

```
const Client = require('ournet.api.client');

const options = {
  api: {
    host: 'api.host.com',
    timeout: 1000 * 2
  },
  cache: {
    // max - max LRU cache elements, ttl - one element ttl
    places_place: { max: 100, ttl: 1000 * 60 * 2 }
  }
};

const client = Client.create(options);

client.query({
  place: {
    name: 'places_place',
    query: '(id:$placeId){id name}',
    variables: { placeId: 685948 }
  }
})
.then(function(data) {
  // data.place.id === 685948;
});

```
