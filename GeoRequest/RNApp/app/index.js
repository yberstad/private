import React, {
    Dimensions,
    Component} from 'react-native';

import {Scene, Router, Modal, TabBar} from 'react-native-router-flux';
import SignIn from './containers/signIn';
import SignOut from './containers/signOut';
import TestGeo from './containers/testGeo';
import SelectLocation from './containers/selectLocation';
import ddpClient from './ddp';

var {width, height} = Dimensions.get('window');
const earthRadiusInKM = 6371;
const radiusInKM = 1.5;
const deg2rad = Math.PI/180;
const rad2deg = 180/Math.PI;
const ASPECT_RATIO = width / height;


export default class RNApp extends Component {
    constructor(props) {
        super(props);

        this.state = {
            region: null,
            connected: false,
            signedIn: false,
            locations: null,
            markers: [],
            error: null
        };

        Date.prototype.addHours= function(h){
            var copiedDate = new Date(this.getTime());
            copiedDate.setHours(copiedDate.getHours()+h);
            return copiedDate;
        }
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

    onCreateEvent(region) {
        var event = {};
        event.title = "Vil du komme på middag?";
        event.description = "Kl 1900 hos meg... :-)";
        event.location = {
            type: "Point",
            coordinates: [region.longitude, region.latitude]
        };

        var user1 = {
            userId: "userid1",
            acknowledged: true,
            accepted: true
        };
        var user2 = {
            userId: "userid2",
            acknowledged: true,
            accepted: true
        };
        event.participants = [];
        event.participants.push(user1);
        event.participants.push(user2);

        event.startTime = new Date().addHours(1);
        event.displayPositionOfCreator = true;
        event.displayPositionForAllParticipants = true;
        event.region = {
            zoomToShowAllUsers: false,
            longitudeDelta: region.latitudeDelta,
            latitudeDelta: region.latitudeDelta
        };
        event.schedule = [];
        ddpClient.addEvent(event, (error, res) => {
            if (error) {
                console.log(error);
                //this.setState({error: error.reason})
            } else {
                console.log(res);
            }
        });
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
                <SelectLocation createEventCallback={(region) => this.onCreateEvent(region)}/>
                // <TestGeo markers={this.state.markers} regionForEvent={this.state.region} createEventCallback={(region) => this.onRegionSelect(region)}
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

        // return <Router sceneStyle={{backgroundColor:'#F7F7F7'}}>
        //     <Scene key="modal" component={Modal} >
        //         <Scene key="root" hideNavBar={true}>
        //             <Scene key="signIn" component={SignIn} title="SignIn" connected={connected} changedSignedIn={(status) => this.handleSignedInStatus(status)}/>
        //             <Scene key="signOut" component={SignOut} title="SignOut" duration={1} changedSignedIn={(status) => this.handleSignedInStatus(status)}/>
        //             <Scene key="home" component={TestGeo} title="TestGeo" type="replace"/>
        //         </Scene>
        //         <Scene key="error" component={Error}/>
        //     </Scene>
        // </Router>;
    }
}
