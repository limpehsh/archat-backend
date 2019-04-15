const { authenticate } = require('feathers-authentication').hooks;
const { setCreatedAt } = require('feathers-hooks-common');

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [],
    get: [],
    create: [ setCreatedAt() ],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [
        
        // Automatically remove meet request from participating user documents after 20000ms
				hook => {
					setTimeout(() => {
						hook.app.service('meet-requests').remove(hook.result._id)
						.then(result => {
							console.log(`successfully removed meet request ${JSON.stringify(hook.result._id)}`);
						}).catch(error => {
							console.log(`error removing meet request ${JSON.stringify(hook.result._id)} after expiry, error`);
						});
					}, 20000);
          // Add this meet request to the sending user's meetRequests field
          hook.app.service('users').update(
              hook.result.fromUser._id,
              { $push: { meetRequests: hook.result } } )
           .then(result => {
            console.log('Successfully updated fromUser document.');
            // Add this meet request to the receiving user's meetRequests field
            hook.app.service('users').update(
              hook.result.toUser._id,
              { $push: { meetRequests: hook.result } } )
           .then(result => {
            console.log('Successfully updated toUser document.');
           }).catch(error => {
            console.log('Error updating toUser document.', error);
           });
          }).catch(error => {
            console.log('Error updating fromUser document.', error);
          });

				}
		],
    update: [],
    patch: [],
    remove: [
    
     hook => { 
       // Remove this meet request from the sending user's meetRequests field
       hook.app.service('users').update(
           hook.result.fromUser._id,
           { $pull: { meetRequests: { _id: hook.result._id } } } )
       .then(result => {
        console.log("Successfully removed meet request in fromUser document.");
        // Remove this meet request from the receiving user's meetRequests field
        hook.app.service('users').update(
            hook.result.toUser._id,
            { $pull: { meetRequests: { _id: hook.result._id } } } )
        .then(result => {
          console.log('Successfully removed meet request in toUser document.');
        }).catch(error => {
          console.log('Error removing meet request in toUser document.', error);
        });
       }).catch(error => {
        console.log('Error removing meet request in fromUser document.', error);
       });
    }

    ]
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
