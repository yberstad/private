import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
 // code to run on server at startup
});

Meteor.methods({
    'getEventList': function() {
        if (!Meteor.userId()) {
            return null;
        }
        return Events.find({ participants: Meteor.userId()});
    }
});

Meteor.methods({
    'getUserList': function() {
        if (!Meteor.userId()) {
            return null;
        }
        return Meteor.users.find({ });
    }
});

Meteor.methods({
    'addEvent': function(event) {
        event.createdBy = (Meteor.userId()) ? Meteor.userId() : '';
        event.timestamp = new Date(location.timestamp);
        Events.schema.validate(event);
        Events.insert(event);
    }
});

Meteor.methods({
    'addPosition': function(position) {
        position.createdBy = (Meteor.userId()) ? Meteor.userId() : '';
        position.timestamp = new Date(location.timestamp);
        Positions.schema.validate(position);
        Positions.insert(position);
    }
});

Meteor.publish('positions', function(eventId) {
    if (!this.userId) {
        return this.ready();
    }
    const sub = this;
    let initializing = true;
    const pipeline = [
        {$match: {eventId: eventId}},
        {$sort: {createdBy: 1, timestamp: 1}},
        {$group: {
            _id: "$createdBy",
            createdBy: {$last: "$createdBy"},
            timestamp: {$last: "$timestamp"},
            coordinates: {$last: "$location.coordinates"}
        }
        }
    ];

    var query = Positions.find( {} );
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
        var matchedLocations =  Positions.aggregate(pipeline);
        _(matchedLocations).forEach(function(location){
            var _id = location.insertedBy;
            if(typeof sub._ids[_id] !== 'undefined'){
                // Aggregate and update our collection with the new data changes
                sub.changed('positions', location.insertedBy, location);
            }
            else {
                // Aggregate and then add a new record to our collection
                sub.added('positions', location.insertedBy, location);
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
