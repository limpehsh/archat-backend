const { authenticate } = require('feathers-authentication').hooks;
const commonHooks = require('feathers-hooks-common');
const { restrictToOwner } = require('feathers-authentication-hooks');
const errors = require('feathers-errors');
const { hashPassword } = require('feathers-authentication-local').hooks;
const crypto = require('crypto');

const restrict = [
  authenticate('jwt'),
  restrictToOwner({
    idField: '_id',
    ownerField: '_id'
  })
];

// User gravatars
const gravatarUrl = 'https://www.gravatar.com/avatar/';
const query = 's=60&d=retro';


module.exports = {
  before: {
    all: [],
    find: [ authenticate('jwt') ],
    get: [ ...restrict ],
    create: [
		hashPassword(), 
		hook => {
			const { email } = hook.data;
			// obtain md5 hash of user email
      const hash = crypto.createHash('md5').update(email).digest('hex');
      // set user avatar field to the gravatar URL which is used to fetch the
      // gravatar image for that user
			hook.data.avatar = `${gravatarUrl}${hash}?${query}`;
		}	
		],
    update: [ ...restrict, hashPassword() ],
    patch: [ ...restrict, hashPassword() ],
    remove: [ ...restrict ]
  },

  after: {
    all: [
      commonHooks.when(
        hook => hook.params.provider,
        // Don't include password hash in response data
        commonHooks.discard('password')
      )
    ],
    find: [],
    get: [],
    create: [],
    update: [
      hook => {
        // Friend is removed from user document
        if(JSON.stringify(hook.data).includes('{"$pull":{"friends"')) {
          
          // First search if this user is still in removed user's friend list
          hook.app.service('users').get(hook.data.$pull.friends._id).then(result => {
            let found = false;
            let friends = result.friends;
            for(let i=0; i < friends.length; i++) {
              if(friends[i]._id == hook.params.user._id) {
                found = true;
                break;
              }
            }

            // If true then also remove this user from other user's friend
            // list - this is to avoid cyclic calls to update
            if(found) {
              hook.app.service('users').update(result._id,
                 { $pull: { friends: { username: hook.params.user.username } } })
              .then(result => {
             console.log('Successfully removed friend from both users.');
             }).catch(error => {
              console.log('Error removing friend from both users.');
             });
          }
        }).catch(error => {
            console.log('Error updating both user friends arrays.', error);    
          });
        }
      }
    ],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [
      // Return error messages if unique constraints for email / username are
      // violated
      hook => {
       if(`${hook.error}`.includes('email')) {
        throw new Error('Email already in use.');
       } 
       if(`${hook.error}`.includes('username')) {
        throw new Error('Username already in use.'); 
       }
      } 
    ],
    update: [],
    patch: [],
    remove: []
  }
};



