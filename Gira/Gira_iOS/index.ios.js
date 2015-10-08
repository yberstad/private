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
				<Login onLoggedIn={this.onLoggedIn} onStartLogin={this.onStartLogin}/>
			);
		}
	},
	onStartLogin: function(){
		this.setState({
			checkingAuth: true
		});
	},
	onLoggedIn: function(){
		this.getGiraRequestType();
		this.setState({
			checkingAuth: false,
			isLoggedIn: true
		});
	},
	getGiraRequestType: function(){
		AzureApi.getAuthInfo((err, authInfo) => {
			if(authInfo){
				AzureApi.getGiraTypeList(authInfo, (err, data) => {
					this.setState({
						checkingAuth: false,
						isLoggedIn: true,
						giraRequestType: data
					});
				});
			}
		});	
	},
	getCultureInfo: function(){
		Culture.getCultureInfo((cultureInfo) => {
			var culture = (cultureInfo) ? cultureInfo.replace('_', '-') : 'nb-NO';
			this.setState({
				culture: culture
			});
		});
	},
	getInitialState: function(){
		return {
			isLoggedIn: false,
			checkingAuth: false,
			culture: 'nb-NO',
			giraRequestType: null
		};
	},
	componentDidMount: function(){
		//AzureApi.removeAuthInfo();
		this.getCultureInfo();
		this.getGiraRequestType();
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
  loader: {
      marginTop: 20
  },
});

AppRegistry.registerComponent('Gira_iOS', () => Gira_iOS);