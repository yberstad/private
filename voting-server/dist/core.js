'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.setEntries = setEntries;
exports.next = next;

var _immutable = require('immutable');

function setEntries(state, entries) {
    return state.set('entries', (0, _immutable.List)(entries));
}

function next(state) {
    var entries = state.get('entries');
    return state.merge({
        vote: (0, _immutable.Map)({ pair: entries.take(2) }),
        entries: entries.skip(2)
    });
}
//# sourceMappingURL=core.js.map
