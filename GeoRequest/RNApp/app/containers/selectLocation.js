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

var MapView = require('react-native-maps');

var {width, height} = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE = 59.90651;
const LONGITUDE = 10.62827;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default class selectLocation extends Component {
    constructor(props) {
        super(props);

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
    }

    createEvent(){
        var region = {
            latitude: this.state.marker.latitude._value,
            longitude: this.state.marker.longitude._value,
            latitudeDelta: this.state.region.latitudeDelta,
            longitudeDelta: this.state.region.longitudeDelta
        };
        this.props.createEventCallback(region);
    }

    getRegion(){
        return (this.props.regionForEvent) ? this.props.regionForEvent : this.state.region;
    }

    onMapPress(e) {
        console.log(e.nativeEvent.coordinate);

        var { marker } = this.state;
        marker.timing({
            longitude: e.nativeEvent.coordinate.longitude,
            latitude: e.nativeEvent.coordinate.latitude
        }).start();
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

