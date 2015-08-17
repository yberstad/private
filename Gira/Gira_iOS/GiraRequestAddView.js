'use strict';

var React = require('react-native');

var {
	View,
	Text,
	TextInput,
	Component,
	AllertIOS
} = React;

var AzureApi = require('./AzureApi');

class GiraRequestAddView extends Component {
	constructor(props){
		super(props);
		this.state = {
			description: ''
		}
	}

	insertItem()
	{
		AzureApi.getAuthInfo((err, authInformation) => {
			AzureApi.insertGiraRequest(this.state.description, authInformation, (error, insertedItem) =>{
				if(error)
				{
					AlertIOS.alert(
						err,
						[
							{
							  text: 'OK',
							  onPress: () => 
							  	console.log('Tapped OK'),
							},
							{
							 text: 'Avbryt',
							  onPress: () => {
							  	console.log('Tapped Cancel');
							  	this.props.navigator.pop();
							  },
							},

						]
					);
				}
				else{
					this.props.navigator.pop();
				}
			});
		});
	}


	render(){
		return (
			<View style={styles.inputDescription}>
				<Text>
					GiraRequestAdd
				</Text>
				<TextInput
                    onChangeText={(text)=> this.setState({description: text})}
                    style={styles.inputDescription}
                    placeholder="Beskrivelse"></TextInput>
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
    inputDescription: {
        height: 50,
        marginTop: 10,
        padding: 4,
        fontSize: 18,
        borderWidth: 1,
        borderColor: '#48BBEC',
        borderRadius: 0,
        color: '#48BBEC'
    }
});

module.exports = GiraRequestAddView;