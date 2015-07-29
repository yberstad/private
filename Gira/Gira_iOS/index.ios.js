/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
} = React;

var AzureManager = require('NativeModules').AzureMSClient;

var Gira_iOS = React.createClass({
  getInitialState() {
    return {
      result: '...',
      userid: 'user_id',
      azureToken : 'azureToken',
      data: '',
    }
  },

  login(){
    AzureManager.loginWithProvider("facebook",  (error, info) => {
      if (error) {
        this.setState({result: error});
      } else {
        this.setState({result: info});
        this.setState({userid: info.userId, azureToken: info.token})
      }
    });
  },

  readData()
  {
    AzureManager.readWithCompletion("GiraRequest", this.state.userid, this.state.azureToken,
        (error, dataReturned) => {
          if(error)
          {
            alert('Error: ' + error);
          }
          else
          {
            this.setState({data: dataReturned});
          }
      });
  },

  render: function() {
    return (
      <View style={styles.container}>
        <TouchableHighlight onPress={this.login}>
          <Text style={styles.welcome}>
            Facebook Login
          </Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={this.readData}>
          <Text style={styles.welcome}>
            Read data
          </Text>
        </TouchableHighlight>
        <Text style={styles.instructions}>
          {this.state.result}
          {this.state.azureToken}
          {this.state.data}
        </Text>
      </View>

    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('Gira_iOS', () => Gira_iOS);
