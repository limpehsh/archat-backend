const users = require('./users/users.service.js');
const messages = require('./messages/messages.service.js');
const meets = require('./meets/meets.service.js');
const friendRequests = require('./friend-requests/friend-requests.service.js');
const meetRequests = require('./meet-requests/meet-requests.service.js');
module.exports = function () {
  const app = this; // eslint-disable-line no-unused-vars
  app.configure(users);
  app.configure(messages);
  app.configure(meets);
  app.configure(friendRequests);
  app.configure(meetRequests);
};
