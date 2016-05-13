import React, {
    Dimensions,
    Component} from 'react-native';

import SignIn from './containers/signIn';
//import SignOut from './containers/signOut';
import TestGeo from './containers/testGeo';

import ddpClient from './ddp';

var {width, height} = Dimensions.get('window');
const earthRadiusInKM = 6371;
const radiusInKM = 1.5;
const deg2rad = Math.PI/180;
const rad2deg = 180/Math.PI;
const ASPECT_RATIO = width / height;
const LATITUDE = 59.90651;
const LONGITUDE = 10.62827;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default class RNApp extends Component {
    constructor(props) {
        super(props);

        this.state = {
            region: null,
            connected: false,
            signedIn: false,
            locations: null,
            markers: []
        };
    }

    componentWillMount() {
        ddpClient.connect((error, wasReconnect) => {
            if (error) {
                this.setState({connected: false});
            } else {
                this.setState({connected: true});
                ddpClient.loginWithToken((err, res) => {
                    if (!err) this.handleSignedInStatus(true);
                });
                this.makeSubscription();
                this.observeLocations();
            }
        });
    }

    makeSubscription() {
        ddpClient.subscribe("locations", ['jaggu'], () => {
            console.log('subscribe-add: ' + JSON.stringify(ddpClient.collections.locations));
            this.setState({locations: ddpClient.collections.locations});
        });
    }

    observeLocations() {
        var _this = this;
        let observer = ddpClient.observe("locations");
        observer.added = (id) => {
            console.log('observe-add: ' + JSON.stringify(ddpClient.collections.locations));
            _this.setState({locations: ddpClient.collections.locations})
            _this.setState({markers: _this.getMarkerList(ddpClient.collections.locations)});
        }
        observer.changed = (id, oldFields, clearedFields, newFields) => {
            console.log('observe-changed: ' + JSON.stringify(ddpClient.collections.locations));
            _this.setState({locations: ddpClient.collections.locations})
            _this.setState({markers: _this.getMarkerList(ddpClient.collections.locations)});
        }
        observer.removed = (id, oldValue) => {
            console.log('observe-removed: ' + JSON.stringify(ddpClient.collections.locations));
            _this.setState({locations: ddpClient.collections.locations})
        }
        
    }

    onRegionSelect(region) {
        this.setState({ region });
    }

    calculateNewRegion(longitude, latitude) {
        var radiusInRad = radiusInKM / earthRadiusInKM;
        var longitudeDelta = rad2deg(radiusInRad / Math.cos(deg2rad(latitude)));
        var latitudeDelta = ASPECT_RATIO * rad2deg(radiusInRad);

        var region = {
            latitude,
            longitude,
            latitudeDelta,
            longitudeDelta,
        };
        return region;
    }

    getMarkerList(collection) {
        var list = [];
        for (var id in collection) {
            var location = collection[id];
            var marker = {};
            marker.latlng = {
                longitude: location.longitude,
                latitude: location.latitude
            };
            marker.title = location.insertedBy;
            marker.description = location.insertedBy;
            list.push(marker);
        }
        return list;
    }


    handleSignedInStatus(status = false) {
        this.setState({signedIn: status});
    }

    render() {
        let {connected, signedIn} = this.state;
        if (connected && signedIn) {
            return (
                <TestGeo markers={this.state.markers} regionForEvent={this.state.region} createEventCallback={(region) => this.onRegionSelect(region)}/>
                // <SignOut
                //   changedSignedIn={(status) => this.handleSignedInStatus(status)}
                //   />
            );
        } else {
            return (
                <SignIn
                    connected={connected}
                    changedSignedIn={(status) => this.handleSignedInStatus(status)}
                />
            );
        }
    }
}
