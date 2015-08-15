'use strict'

var React = require('react-native');

var {
	View,
	Text,
	Image,
	TouchableHighlight,
	Component
} = React;

var AzureApi = require('./AzureApi');

class Login extends Component{
	constructor(props)
	{
		super(props);
	}

	onLoginPressed(provider){
		AzureApi.login(provider, (err, info) =>
		{
			if(err == null && this.props.onLogin)
			{
				this.props.onLogin();
			}
		});
	}

	render(){
		return (
			<View style={styles.container}>
				
				<Text style={styles.heading}>GIRA!</Text>
				<TouchableHighlight style={styles.button} onPress={this.onLoginPressed("facebook")}>
					<Text style={styles.buttonText}>Logg inn med Facebook</Text>
				</TouchableHighlight>
			</View>
		);
	}
}

var styles = React.StyleSheet.create({
	container: {
		backgroundColor: '#F5FCFF',
		paddingTop: 40,
		padding: 10,
		alignItems: 'center',
		flex: 1
	},
	logo: {
		width: 66,
		height: 55
	},
    loginInput: {
        height: 50,
        marginTop: 10,
        padding: 4,
        fontSize: 18,
        borderWidth: 1,
        borderColor: '#48BBEC',
        borderRadius: 0,
        color: '#48BBEC'
    },
    button: {
        height: 50,
        backgroundColor: '#48BBEC',
        borderColor: '#48BBEC',
        alignSelf: 'stretch',
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText: {
        color: '#fff',
        fontSize: 24
    }	
});

module.exports = Login;