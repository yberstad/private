
Locations = new Mongo.Collection('locations');
TempLocations = new Mongo.Collection('templocations');
Locations.schema = new SimpleSchema({
    longitude: {type: Number, decimal: true, min: -180, max: 180},
    latitude: {type: Number, decimal: true, min: -90, max: 90},
    insertedBy: {type: String},
    geoRequestId: {type: String},
    timestamp: {type: Date}
});

Meteor.methods({
    'addLocation': function(location) {
        location.insertedBy = (Meteor.userId()) ? Meteor.userId() : '';
        location.timestamp = new Date(location.timestamp);
        Locations.schema.validate(location);
        Locations.insert(location);
    }
})