'use strict';

const globalHooks = require('../../../hooks');
const createUser = require('./logCreateUser');
const auth = require('feathers-authentication').hooks;

exports.before = {
  all: [],
  find: [
    auth.verifyToken(),
    auth.populateUser(),
    auth.requireAuth()
  ],
  get: [
    auth.verifyToken(),
    auth.populateUser(),
    auth.requireAuth()
  ],
  create: [
    createUser(),
    auth.hashPassword()
  ],
  update: [
    auth.verifyToken(),
    auth.populateUser(),
    auth.requireAuth()
  ],
  patch: [
    auth.verifyToken(),
    auth.populateUser(),
    auth.requireAuth()
  ],
  remove: [
    auth.verifyToken(),
    auth.populateUser(),
    auth.requireAuth()
  ]
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
