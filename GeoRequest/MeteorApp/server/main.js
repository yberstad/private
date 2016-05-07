import { Meteor } from 'meteor/meteor';
var Random = require('meteor-random');
// var btoa = require('btoa');
import { ReactiveAggregate } from 'meteor/jcbernack:reactive-aggregate';

Meteor.startup(() => {
  // code to run on server at startup
});

Meteor.publish('locations', function(geoRequestId) {
    const sub = this;
    let initializing = true;
    const pipeline = [
        {$match: {geoRequestId: geoRequestId}},
        {$sort: {insertedBy: 1, timestamp: 1}},
        {$group: {
            _id: "$insertedBy",
            insertedBy: {$last: "$insertedBy"},
            timestamp: {$last: "$timestamp"},
            latitude: {$last: "$latitude"},
            longitude: {$last: "$longitude"},
        }
        }
    ];

    var query = Locations.find( {} );
    var handle = query.observeChanges({
        added: function (id) {
            // observeChanges only returns after the initial `added` callbacks
            // have run. Until then, we don't want to send a lot of
            // `self.changed()` messages - hence tracking the
            // `initializing` state.
            if (!initializing) {
                runAggregation();
            }
        },
        error: function(err){
            throw new Meteor.Error('Uh oh! something went wrong!', err.message);
        }
    });

    // Wrap the aggregation call inside of a function
    // since it will be called more than once
    function runAggregation() {
        sub._ids = sub._ids || {};
        sub._iteration = sub._iteration || 0;
        var matchedLocations =  Locations.aggregate(pipeline);
        _(matchedLocations).forEach(function(location){
            var _id = location.insertedBy;
            if(typeof sub._ids[_id] !== 'undefined'){
                // Aggregate and update our collection with the new data changes
                sub.changed('locations', location.insertedBy, location);
            }
            else {
                // Aggregate and then add a new record to our collection
                sub.added('locations', location.insertedBy, location);
            }
            sub._ids[_id] = sub._iteration++;
        });
    }

    // Instead, we'll send one `self.added()` message right after
    // observeChanges has returned, and mark the subscription as
    // ready.
    initializing = false;
    // Run the aggregation initially to add some data to our aggregation collection
    runAggregation();
    sub.ready();
    // Stop observing the cursor when client unsubs.
    // Stopping a subscription automatically takes
    // care of sending the client any removed messages.
    sub.onStop(function () {
        handle.stop();
    });
});

// Meteor.publish('locations', function(geoRequestId) {
//     var _this = this;
//     if (!this.userId) {
//         return this.ready();
//     }
//
//     var pipeline = [
//         {$match: {geoRequestId: geoRequestId}},
//         {$sort: {insertedBy: 1, timestamp: 1}},
//         {$group: {_id: "$insertedBy", timestamp: {$last: "$timestamp" }}}
//     ];
//
//     ReactiveAggregate(_this, Locations, pipeline);
// });
// Meteor.publish('locationsAggregate', function(geoRequestId) {
//     var _this = this;
//     if (!this.userId) {
//         return this.ready();
//     }
//
//     // return Locations.rawCollection().aggregate(
//     //     { $sort: { insertedBy: 1, timestamp: 1 } },
//     //     {
//     //         $group:
//     //         {
//     //             user: "insertedBy",
//     //             timestamp: { $last: "$timestamp" },
//     //             longitude: 1,
//     //             latitude: 1
//     //         }
//     //     }
//     // );
//
//     var pipeline = [
//         {$match: {geoRequestId: geoRequestId}},
//         {$sort: {insertedBy: 1, timestamp: 1}},
//         {$group: {_id: "$insertedBy", timestamp: {$last: "$timestamp" }}}
//     ];
//
//     var matchedLocations =  Locations.aggregate(pipeline);
//     _(matchedLocations).forEach(function(location){
//         _this.added('locationsAggregate', Random.id(), location)
//     });
//
//     _this.ready();
//
//
//     // return Locations.find({
//     //     geoRequestId: geoRequestId
//     // }, {
//     //     fields: {longitude: 1, latitude: 1, timestamp: 1, insertedBy: 1}
//     // });
// });

// Meteor.publish('locations', function(geoRequestId) {
//     if (!this.userId) {
//         return this.ready();
//     }
//
//     return Locations.find({
//         geoRequestId: geoRequestId
//     }, {
//         fields: {longitude: 1, latitude: 1, timestamp: 1, insertedBy: 1}
//     });
// });
