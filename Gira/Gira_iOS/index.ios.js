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
var Culture = require('NativeModules').CultureInfo;

var Gira_iOS = React.createClass({
	componentDidMount: function(){
		//AzureApi.removeAuthInfo();
		Culture.getCultureInfo((cultureInfo) => {
			var culture = (cultureInfo) ? cultureInfo.replace('_', '-') : 'nb-NO';
			this.setState({
				culture: culture
			});
		});
		AzureApi.getAuthInfo((err, authInfo) => {
			AzureApi.getGiraTypeList(authInfo, (err, data) => {
				this.setState({
					checkingAuth: false,
					isLoggedIn: authInfo != null,
					giraRequestType: data
				});
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
				<AppContainer culture={this.state.culture} giraRequestType={this.state.giraRequestType} />
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
			checkingAuth: true,
			culture: 'nb-NO',
			giraRequestType: null
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