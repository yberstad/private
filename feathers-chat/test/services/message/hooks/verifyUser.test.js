'use strict';

const assert = require('assert');
const verifyUser = require('../../../../src/services/message/hooks/verifyUser.js');

describe('message verifyUser hook', () => {
  it('hook can be used', () => {
    const mockHook = {
      type: 'before',
      app: {},
      params: {},
      result: {},
      data: {}
    };
    
    verifyUser()(mockHook);
    
    assert.ok(mockHook.verifyUser);
  });
});
