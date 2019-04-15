/* eslint no-console: 1 */
console.warn('You are using the default filter for the users service. For more information about event filters see https://docs.feathersjs.com/api/events.html#event-filtering'); // eslint-disable-line no-console

module.exports = function (data, connection, hook) { // eslint-disable-line no-unused-vars

 // If location field of user document was updated, notify other users
 // participating in that meet of the updated user data 
 if(JSON.stringify(hook.data).includes('location')) {
  for(let user of connection.user.activeMeet.participants) {
    if(user == data._id) {
      return {
        updateData: {
          _id: data._id,
          email: data.email,
          username: data.username,
          location: data.location,
          avatar: data.avatar
        },
        updateType: 'location'
      };
    }
  } 
    return false;

// Otherwise only the same user is notified of it's corresponding updated user
// document
} else {
   if(data._id == connection.user._id) {
    return {
      updateData: data,
      updateType: 'user'
    };
   } else{
    return false;
   } 
 }

};
