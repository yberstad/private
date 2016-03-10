'use strict';

// src/services/message/hooks/verifyUser.js.js
//
// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/hooks/readme.html

const errors = require('feathers-errors');

module.exports = function(options) {
  return function(hook) {
    const params = hook.params; // service params
    const messageService = hook.app.service('messages');

    // First get the message that the user wants to access
    return messageService.get(hook.id).then(message => {
        // Throw a not authenticated error if the message and user id don't match
        if(message.user_id !== params.user._id) {
      throw new errors.NotAuthenticated('Access not allowed');
    }

    // Otherwise just return the hook
    return hook;
  });
  };
};
