import React, {
    Dimensions,
    Component,
    View,
    StyleSheet
} from 'react-native';

var MapView = require('react-native-maps');
var {width, height} = Dimensions.get('window');

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
    }

    onMapPress(coordinate) {
        console.log(coordinate);
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
                />
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

