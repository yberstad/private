import React, {
    Dimensions,
    Component,
    View,
    StyleSheet,
    Platform
} from 'react-native';

import ddpClient from '../ddp';

var MapView = require('react-native-maps');
var {width, height} = Dimensions.get('window');

var BackgroundGeolocation = require('react-native-background-geolocation');
// if (Platform.OS === 'android')
// {
//     BackgroundGeolocation = require('react-native-background-geolocation-android');
// }
// else {
//     BackgroundGeolocation = require('react-native-background-geolocation');
// }


// BackgroundGeolocation.configure({
//     // License validations
//     orderId: '1486',
//     license: '4bbb513c013111eae951647fd4f9e79f127fce6f7a00e9d327db9ea2a053a0df',
//
//     // Geolocation config
//     desiredAccuracy: 0,
//     distanceFilter: 50,
//     locationUpdateInterval: 5000,
//     fastestLocationUpdateInterval: 5000,
//
//     // Activity Recognition config
//     minimumActivityRecognitionConfidence: 80,   // 0-100%.  Minimum activity-confidence for a state-change
//     activityRecognitionInterval: 10000,
//     stopDetectionDelay: 1,  // <--  minutes to delay after motion stops before engaging stop-detection system
//     stopTimeout: 2, // 2 minutes
//
//     // Application config
//     debug: true, // <-- enable this hear sounds for background-geolocation life-cycle.
//     forceReloadOnLocationChange: false,  // <-- [Android] If the user closes the app **while location-tracking is started** , reboot app when a new location is recorded (WARNING: possibly distruptive to user)
//     forceReloadOnMotionChange: false,    // <-- [Android] If the user closes the app **while location-tracking is started** , reboot app when device changes stationary-state (stationary->moving or vice-versa) --WARNING: possibly distruptive to user)
//     forceReloadOnGeofence: false,        // <-- [Android] If the user closes the app **while location-tracking is started** , reboot app when a geofence crossing occurs --WARNING: possibly distruptive to user)
//     stopOnTerminate: false,              // <-- [Android] Allow the background-service to run headless when user closes the app.
//     startOnBoot: true,                   // <-- [Android] Auto start background-service in headless mode when device is powered-up.
//
//     // HTTP / SQLite config
//     url: 'http://posttestserver.com/post.php?dir=cordova-background-geolocation',
//     batchSync: false,       // <-- [Default: false] Set true to sync locations to server in a single HTTP request.
//     maxBatchSize: 100,      // <-- If using batchSync: true, specifies the max number of records send with each HTTP request.
//     autoSync: true,         // <-- [Default: true] Set true to sync each location to server as it arrives.
//     maxDaysToPersist: 1,    // <-- Maximum days to persist a location in plugin's SQLite database when HTTP fails
//     headers: {
//         "X-FOO": "bar"
//     },
//     params: {
//         "auth_token": "maybe_your_server_authenticates_via_token_YES?"
//     }
// });

BackgroundGeolocation.configure({
    desiredAccuracy: 0,
    stationaryRadius: 50,
    distanceFilter: 50,
    disableElasticity: false, // <-- [iOS] Default is 'false'.  Set true to disable speed-based distanceFilter elasticity
    locationUpdateInterval: 5000,
    minimumActivityRecognitionConfidence: 80,   // 0-100%.  Minimum activity-confidence for a state-change
    fastestLocationUpdateInterval: 5000,
    activityRecognitionInterval: 10000,
    stopDetectionDelay: 1,  // <--  minutes to delay after motion stops before engaging stop-detection system
    stopTimeout: 2, // 2 minutes
    activityType: 'AutomotiveNavigation',

    // Application config
    debug: true, // <-- enable this hear sounds for background-geolocation life-cycle.
    forceReloadOnLocationChange: false,  // <-- [Android] If the user closes the app **while location-tracking is started** , reboot app when a new location is recorded (WARNING: possibly distruptive to user)
    forceReloadOnMotionChange: false,    // <-- [Android] If the user closes the app **while location-tracking is started** , reboot app when device changes stationary-state (stationary->moving or vice-versa) --WARNING: possibly distruptive to user)
    forceReloadOnGeofence: false,        // <-- [Android] If the user closes the app **while location-tracking is started** , reboot app when a geofence crossing occurs --WARNING: possibly distruptive to user)
    stopOnTerminate: false,              // <-- [Android] Allow the background-service to run headless when user closes the app.
    startOnBoot: true,                   // <-- [Android] Auto start background-service in headless mode when device is powered-up.

    // HTTP / SQLite config
    // url: 'http://posttestserver.com/post.php?dir=cordova-background-geolocation',
    // batchSync: false,       // <-- [Default: false] Set true to sync locations to server in a single HTTP request.
    autoSync: false,         // <-- [Default: true] Set true to sync each location to server as it arrives.
    // maxDaysToPersist: 1,    // <-- Maximum days to persist a location in plugin's SQLite database when HTTP fails
    // headers: {
    //     "X-FOO": "bar"
    // },
    // params: {
    //     "auth_token": "maybe_your_server_authenticates_via_token_YES?"
    // }
});

const ASPECT_RATIO = width / height;
const LATITUDE = 62.47222;
const LONGITUDE = 6.14948;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default class testGeo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            region: {
                latitude: LATITUDE,
                longitude: LONGITUDE,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA
            },
            zoomEnabled: true,
            initialPosition: 'unknown',
            lastPosition: 'unknown'
        };

        // This handler fires whenever bgGeo receives a location update.
        BackgroundGeolocation.on('location', function(location) {
            var locationData = {
                longitude: location.coords.longitude,
                latitude: location.coords.latitude,
                geoRequestId: 'jaggu',
                timestamp: location.timestamp
            }
            ddpClient.call('addLocation', [locationData]);

            console.log('- [js]location: ', JSON.stringify(location));
        });

        // This handler fires whenever bgGeo receives an error
        BackgroundGeolocation.on('error', function(error) {
            var type = error.type;
            var code = error.code;
            alert(type + " Error: " + code);
        });

        // This handler fires when movement states changes (stationary->moving; moving->stationary)
        BackgroundGeolocation.on('motionchange', function(location) {
            var locationData = {
                longitude: location.coords.longitude,
                latitude: location.coords.latitude,
                geoRequestId: 'jaggu',
                timestamp: location.timestamp
            }
            ddpClient.call('addLocation', [locationData]);
        });

        BackgroundGeolocation.start(function() {
            console.log('- [js] BackgroundGeolocation started successfully');

            // Fetch current position
            BackgroundGeolocation.getCurrentPosition({timeout: 30}, function(location) {
                var locationData = {
                    longitude: location.coords.longitude,
                    latitude: location.coords.latitude,
                    geoRequestId: 'jaggu',
                    timestamp: location.timestamp
                }
                ddpClient.call('addLocation', [locationData]);
                console.log('- [js] BackgroundGeolocation received current position: ', JSON.stringify(location));
            }, function(error) {
                alert("Location error: " + error);
            });
        });

        // Call #stop to halt all tracking
        // BackgroundGeolocation.stop();
    }

    onMapPress(e) {
        console.log(e.nativeEvent.coordinate);
    }

    render() {
        return (
            <View style={styles.container}>
                <MapView
                    ref="map"
                    style={styles.map}
                    region={this.state.region}
                    onRegionChange={this.onRegionChange}
                    zoomEnabled={this.state.zoomEnabled}
                    onPress={this.onMapPress}
                >
                    {this.props.markers.map(marker => (
                        <MapView.Marker
                            coordinate={marker.latlng}
                            title={marker.title}
                            description={marker.description}
                        />
                    ))}
                </MapView>
            </View>
        );
    };
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    map: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    }
});

