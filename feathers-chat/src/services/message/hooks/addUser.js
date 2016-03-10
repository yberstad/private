'use strict';

// src/services/message/hooks/addUser.js.js
//
// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/hooks/readme.html

module.exports = function(options) {
  return function(hook) {
    // Set the data to the user id
    hook.data.user_id = hook.params.user._id;
  };
};
