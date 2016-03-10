'use strict';

const assert = require('assert');
const addUser = require('../../../../src/services/message/hooks/addUser.js');

describe('message addUser hook', () => {
  it('hook can be used', () => {
    const mockHook = {
      type: 'before',
      app: {},
      params: {},
      result: {},
      data: {}
    };
    
    addUser()(mockHook);
    
    assert.ok(mockHook.addUser);
  });
});
