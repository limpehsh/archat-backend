/* eslint no-console: 1 */
console.warn('You are using the default filter for the meets service. For more information about event filters see https://docs.feathersjs.com/api/events.html#event-filtering'); // eslint-disable-line no-console

module.exports = function (data, connection, hook) { // eslint-disable-line no-unused-vars
  // Only notify participating users of meet creation
  for (let user of data.participants) {
    if(user == connection.user._id) {
      console.log(user.username + 'notified of meet creation.');
      return data
   }
 }
  return false;
};
