Events = new Mongo.Collection('events');
Events.schema = new SimpleSchema({
    title: {
        type: String
    },
    description: {
        type: String
    },
    location: {
        type: Object,
        index: "2dsphere"
    },
    "location.type": {
        type: String,
        allowedValues: ["Point"]
    },
    "location.coordinates": {
        type: [Number],
        decimal: true,
        minCount: 2,
        maxCount: 2,
        optional: false
    },
    participants: {
        type: [String]
    },
    startTime: {
        type: Date
    },
    schedule: {
        type: [String]
    },
    displayPositionOfCreator: {
        type: Boolean
    },
    displayPositionForAllParticipants: {
        type: Boolean
    },
    region:{
        type: Object
    },
    'region.showAllUsers': {
        type: Boolean
    },
    'region.longitudeDelta': {
        type: Number,
        decimal: true
    },
    'region.latitudeDelta': {
        type: Number,
        decimal: true
    },
    createdBy: {
        type: String
    },
    timestamp: {
        type: Date
    }
});

Positions = new Mongo.Collection('positions');
Positions.schema = new SimpleSchema({
    eventId: {type: String},
    location: {
        type: Object,
        index: '2dsphere'
    },
    'location.type': {
        type: String,
        allowedValues: ['Point']
    },
    'location.coordinates': {
        type: [Number],
        decimal: true,
        minCount: 2,
        maxCount: 2,
        optional: false
    },
    createdBy: {
        type: String
    },
    timestamp: {
        type: Date
    }
});


Locations = new Mongo.Collection('locations');
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
});