/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');

import ExNavigator from '@exponent/react-native-navigator';

var AppRouter = require('./Router.js');
var TopModal = require('./TopModal.js');



var {
  AppRegistry,
  View,
  Text,
  StyleSheet
} = React;

class Component extends  React.Component {

  constructor(props){
      super(props)

      this.state = {
        modal: false,
      }
  }

  openModal() {
    console.log("Hello from Open Modal");
    this.setState({modal: true})
  }


  render () {
    return (

      <View style={styles.container}>
        <ExNavigator

          initialRoute={AppRouter.getHomeRoute(this.openModal.bind(this))}
          style={{ flex: 1 }}
          sceneStyle={{ paddingTop: 64 }}
        />
        {this.state.modal ? <TopModal closeModal={() => this.setState({modal: false}) }/> : null }
      </View>

    )
  }



}

var styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});





module.exports = Component
