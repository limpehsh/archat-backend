const assert = require('assert');
const app = require('../../src/app');

describe('\'meets\' service', () => {
  it('registered the service', () => {
    const service = app.service('meets');

    assert.ok(service, 'Registered the service');
  });
});
