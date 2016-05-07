import React, {Component} from 'react-native';

import SignIn from './containers/signIn';
//import SignOut from './containers/signOut';
import TestGeo from './containers/testGeo';

import ddpClient from './ddp';

export default class RNApp extends Component {
    constructor(props) {
        super(props);

        this.state = {
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
            this.setState({locations: ddpClient.collections.locations})
        }
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
                <TestGeo markers={this.state.markers}/>
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
