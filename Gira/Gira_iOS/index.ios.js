'use strict';

var React = require('react-native');

var {
	AppRegistry,
	StyleSheet,
	ActivityIndicatorIOS,
	View
} = React;

var Login = require('./Login');
var AppContainer = require('./AppContainer');
var AzureApi = require('./AzureApi');

var Gira_iOS = React.createClass({
	componentDidMount: function(){
		/*ßAzureApi.removeAuthInfo();*/
		AzureApi.getAuthInfo((err, authInfo) => {
			this.setState({
				checkingAuth: false,
				isLoggedIn: authInfo != null
			});
		});
	},

	render: function() {
		if(this.state.checkingAuth){
			return (
				<View style={styles.container}>
					<ActivityIndicatorIOS
						animating={true}
						size="large"
						style={styles.loader} />
				</View>
			);
		}

		if(this.state.isLoggedIn){
			return(
				<AppContainer />
			);
		}
		else{
			return (
				<Login onLogin={this.onLogin} />
			);
		}
	},
	onLogin: function(){
		this.setState({
			isLoggedIn: true
		});
	},
	getInitialState: function(){
		return {
			isLoggedIn: false,
			checkingAuth: true
		};
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