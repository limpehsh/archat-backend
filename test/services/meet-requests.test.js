const assert = require('assert');
const app = require('../../src/app');

describe('\'meet-requests\' service', () => {
  it('registered the service', () => {
    const service = app.service('meet-requests');

    assert.ok(service, 'Registered the service');
  });
});
