import React, {
    Dimensions,
    Component,
    View,
    StyleSheet,
    Platform,
    Text,
    TouchableOpacity,
    Animated
} from 'react-native';

import ddpClient from '../ddp';

var MapView = require('react-native-maps');


var BackgroundGeolocation = require('react-native-background-geolocation');
var {width, height} = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE = 59.90651;
const LONGITUDE = 10.62827;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

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
    stationaryRadius: 1,
    distanceFilter: 1,
    disableElasticity: true, // <-- [iOS] Default is 'false'.  Set true to disable speed-based distanceFilter elasticity
    locationUpdateInterval: 5000,
    minimumActivityRecognitionConfidence: 80,   // 0-100%.  Minimum activity-confidence for a state-change
    fastestLocationUpdateInterval: 5000,
    activityRecognitionInterval: 10000,
    activityType: 'Fitness',
    disableStopDetection: true,
    // Application config,
    stopDetectionDelay: 30,
    debug: true, // <-- enable this hear sounds for background-geolocation life-cycle.
    forceReloadOnLocationChange: false,  // <-- [Android] If the user closes the app **while location-tracking is started** , reboot app when a new location is recorded (WARNING: possibly distruptive to user)
    forceReloadOnMotionChange: false,    // <-- [Android] If the user closes the app **while location-tracking is started** , reboot app when device changes stationary-state (stationary->moving or vice-versa) --WARNING: possibly distruptive to user)
    forceReloadOnGeofence: false,        // <-- [Android] If the user closes the app **while location-tracking is started** , reboot app when a geofence crossing occurs --WARNING: possibly distruptive to user)
    stopOnTerminate: false,              // <-- [Android] Allow the background-service to run headless when user closes the app.
    startOnBoot: true,                   // <-- [Android] Auto start background-service in headless mode when device is powered-up.
    pausesLocationUpdatesAutomatically: false,
    stopTimeout: 30,
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

export default class testGeo extends Component {
    constructor(props) {
        super(props);

        // var marker = {};
        // marker.latlng = {
        //     longitude: LATITUDE,
        //     latitude: LONGITUDE
        // };
        // marker.title = 'Selected possition';
        // marker.description = 'Press create to confirm selected position';
        
        this.state = {
            marker: new Animated.Region({
                latitude: LATITUDE,
                longitude: LONGITUDE
            }),
            region: new Animated.Region({
            latitude: LATITUDE,
            longitude: LONGITUDE,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA
        }),
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
                BackgroundGeolocation.changePace(true);
                console.log('- [js] BackgroundGeolocation received current position: ', JSON.stringify(location));
            }, function(error) {
                alert("Location error: " + error);
            });
        });

        // Call #stop to halt all tracking
        // BackgroundGeolocation.stop();
    }

    createEvent(){
        var region = new Animated.Region({
            latitude: this.state.marker.latitude,
            longitude: this.state.marker.longitude,
            latitudeDelta: this.state.region.latitudeDelta,
            longitudeDelta: this.state.region.longitudeDelta
        });
        this.props.createEventCallback(region);
    }

    getRegion(){
        return (this.props.regionForEvent) ? this.props.regionForEvent : this.state.region;
    }

    onMapPress(e) {
        console.log(e.nativeEvent.coordinate);
        // var region = new Animated.Region({
        //     latitude: e.nativeEvent.coordinate.latitude,
        //     longitude: e.nativeEvent.coordinate.longitude,
        //     latitudeDelta: this.state.region.latitudeDelta,
        //     longitudeDelta: this.state.region.longitudeDelta
        // });

        // var marker = {};
        // marker.latlng = {
        //     longitude: e.nativeEvent.coordinate.longitude,
        //     latitude: e.nativeEvent.coordinate.latitude
        // };
        // marker.title = this.state.marker.title;
        // marker.description = this.state.marker.description;

        // var marker = new Animated.Region({
        //     longitude: e.nativeEvent.coordinate.longitude,
        //     latitude: e.nativeEvent.coordinate.latitude
        // });

        var { marker } = this.state;
        marker.timing({
            longitude: e.nativeEvent.coordinate.longitude,
            latitude: e.nativeEvent.coordinate.latitude
        }).start();

        //this.setState({region: region});
    }

    onRegionChange(region) {
        this.setState({ region });
    }

    getRegionAsText()
    {
        return this.state.region.latitude + ', ' + this.state.region.longitude + ', ' + this.state.region.latitudeDelta+ ', ' +this.state.region.longitudeDelta;
    }

    render() {
        return (
            <View style={styles.container}>
                <MapView.Animated
                    ref="map"
                    style={styles.map}
                    region={this.getRegion()}
                    onRegionChange={(region) => this.onRegionChange(region)}
                    zoomEnabled={this.state.zoomEnabled}
                    onPress={(e) => this.onMapPress(e)}
                >
                    {this.props.markers.map(marker => (
                        <MapView.Marker
                            coordinate={marker.latlng}
                            title={marker.title}
                            description={marker.description}
                        />
                    ))}
                    <MapView.Marker.Animated
                        coordinate={this.state.marker}
                    />
                </MapView.Animated>
                <View style={[styles.bubble, styles.latlng]}>
                    <Text style={{ textAlign: 'center'}}>
                        {this.getRegionAsText()}
                    </Text>
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={() => this.createEvent()} style={[styles.bubble, styles.button]}>
                        <Text>Create event</Text>
                    </TouchableOpacity>
                </View>

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
    },
    bubble: {
        backgroundColor: 'rgba(255,255,255,0.7)',
        paddingHorizontal: 18,
        paddingVertical: 12,
        borderRadius: 20,
    },
    latlng: {
        width: 200,
        alignItems: 'stretch',
    },
    button: {
        width: 80,
        paddingHorizontal: 12,
        alignItems: 'center',
        marginHorizontal: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        marginVertical: 20,
        backgroundColor: 'transparent',
    },
});

