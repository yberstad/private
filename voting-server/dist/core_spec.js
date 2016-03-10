'use strict';

var _immutable = require('immutable');

var _chai = require('chai');

var _core = require('../src/core');

describe('application logic', function () {

    describe('setEntries', function () {

        it('adds the entries to the state', function () {
            var state = (0, _immutable.Map)();
            var entries = _immutable.List.of('Trainspotting', '28 Days Later');
            var nextState = (0, _core.setEntries)(state, entries);
            (0, _chai.expect)(nextState).to.equal((0, _immutable.Map)({
                entries: _immutable.List.of('Trainspotting', '28 Days Later')
            }));
        });

        it('takes the next two entries under vote', function () {
            var state = (0, _immutable.Map)({
                entries: _immutable.List.of('Trainspotting', '28 Days Later', 'Sunshine')
            });
            var nextState = (0, _core.next)(state);
            (0, _chai.expect)(nextState).to.equal((0, _immutable.Map)({
                vote: (0, _immutable.Map)({
                    pair: _immutable.List.of('Trainspotting', '28 Days Later')
                }),
                entries: _immutable.List.of('Sunshine')
            }));
        });
    });
});
//# sourceMappingURL=core_spec.js.map
