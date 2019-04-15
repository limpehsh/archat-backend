const { authenticate } = require('feathers-authentication').hooks;
const { setCreatedAt } = require('feathers-hooks-common');


module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [],
    get: [],
    create: [setCreatedAt()],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [

				hook => {

          // Add this meet request to the sending user's meetRequests field
          hook.app.service('users').update(
              hook.result.fromUser._id,
              { $push: { friendRequests: hook.result } } )
           .then(result => {
            console.log('Successfully updated fromUser document.');
            // Add this meet request to the receiving user's meetRequests field
            hook.app.service('users').update(
              hook.result.toUser._id,
              { $push: { friendRequests: hook.result } } )
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
    update: [

      hook => {

        hook.app.service('users').update(
          hook.result.fromUser._id,
          {$push: {friends: {_id: hook.result.toUser._id,username:hook.result.toUser.username,
          email:hook.result.toUser.email,avatar:hook.result.toUser.avatar} } }

        ).then(result => {
         console.log("Successfully add friend request in fromUser document.");
         hook.app.service('users').update(
             hook.result.toUser._id,
             {$push: {"friends": {"_id": hook.result.fromUser._id,"username":hook.result.fromUser.username,
             "email":hook.result.fromUser.email,"avatar":hook.result.fromUser.avatar} } } )
         .then(result => {
           console.log('Successfully add friend request in toUser document.');
         }).catch(error => {
           console.log('Error adding friend request in toUser document.', error);
         });
        }).catch(error => {
         console.log('Error adding friend request in fromUser document.', error);
        });
      }
    ],
    patch: [],
    remove: [

     hook => {
      // Remove this meet request from the sending user's meetRequests field
      hook.app.service('users').update(
          hook.result.fromUser._id,
          { $pull: { friendRequests: { _id: hook.result._id } } } )
      .then(result => {
       console.log("Successfully removed friend request in fromUser document.");
       // Remove this meet request from the receiving user's meetRequests field
       hook.app.service('users').update(
           hook.result.toUser._id,
           { $pull: { friendRequests: { _id: hook.result._id } } } )
       .then(result => {
         console.log('Successfully removed friend request in toUser document.');
       }).catch(error => {
         console.log('Error removing friend request in toUser document.', error);
       });
      }).catch(error => {
       console.log('Error removing friend request in fromUser document.', error);
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
