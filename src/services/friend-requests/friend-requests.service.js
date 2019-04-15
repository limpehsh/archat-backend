// Initializes the `friend-requests` service on path `/friend-requests`
const createService = require('feathers-mongodb');
const hooks = require('./friend-requests.hooks');
const filters = require('./friend-requests.filters');

module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');
  const mongoClient = app.get('mongoClient');
  const options = { paginate };

  // Initialize our service with any options it requires
  app.use('/friend-requests', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('friend-requests');

  mongoClient.then(db => {
    service.Model = db.collection('friend_requests');
  });

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
