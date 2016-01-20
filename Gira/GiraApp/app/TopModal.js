'use strict';

var React = require('react-native');

var {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View,
  Navigator,
  TouchableOpacity,
  Animated,
  Dimensions,
  Image
} = React;

var windowSize = Dimensions.get('window');
var {
  height: deviceHeight
} = Dimensions.get('window');



class component extends Component {

  constructor(props){
      super (props)

      this.state = {
        offset: new Animated.Value(-deviceHeight)
      //  offset: new Animated.Value(deviceHeight)
      }
  }

  componentDidMount() {
    Animated.timing(this.state.offset, {
      duration: 150,
      toValue: 0
    }).start();
  }



  closeModal() {
    Animated.timing(this.state.offset, {
      duration: 150,
      toValue: -deviceHeight
      //toValue: deviceHeight
    }).start(this.props.closeModal);
  }



  render() {

      return (
        <Animated.View style={[styles.modal, styles.flexCenter, {transform: [{translateY: this.state.offset}]}]}>
          <View style={styles.header}>
            <Image source={require('image!modalheader')} style={styles.bg}/>
          </View>
          <View style={styles.body}>
            <TouchableOpacity onPress={this.closeModal.bind(this)}>
              <Text style={{color: '#FFF',textAlign: 'center'}}>Close Modal {'\n'} (You could place another ExNavigator here)</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

      )
  }
}


var styles = StyleSheet.create({
  flexCenter: {
    flex: 1,
    flexDirection: 'column'
  },
  header: {
    flex: .2
  },
  body: {
    flex: .8
  },
  bg: {
    position: 'absolute',
    left: 0,
    right: 0,
    width: windowSize.width,
    height:100,
    flex: 1
  },
  modal: {
    backgroundColor: 'rgba(0,0,0,.8)',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  }
});


module.exports = component
