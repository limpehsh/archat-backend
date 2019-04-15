// Initializes the `meet-requests` service on path `/meet-requests`
const createService = require('feathers-mongodb');
const hooks = require('./meet-requests.hooks');
const filters = require('./meet-requests.filters');

module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');
  const mongoClient = app.get('mongoClient');
  const options = { paginate };

  // Initialize our service with any options it requires
  app.use('/meet-requests', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('meet-requests');

  mongoClient.then(db => {
    service.Model = db.collection('meet_requests');
  });

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
