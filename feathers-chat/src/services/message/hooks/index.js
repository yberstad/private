'use strict';

const addUser = require('./addUser');

const verifyUser = require('./verifyUser');

const globalHooks = require('../../../hooks');
const auth = require('feathers-authentication').hooks;

exports.before = {
  all: [
    auth.verifyToken(),
    auth.populateUser(),
    auth.requireAuth()
  ],
  find: [],
  get: [],
  create: [addUser()],
  update: [verifyUser()],
  patch: [verifyUser()],
  remove: [verifyUser()]
};

exports.after = {
  all: [],
  find: [],
  get: [],
  create: [],
  update: [],
  patch: [],
  remove: []
};
