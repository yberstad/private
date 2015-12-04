'use strict';

var React = require('react-native');
var AzureApi = require('./AzureApi')

var {
	Text,
	View,
	Component,
	StyleSheet,
	PixelRatio,
	Image,
	AlertIOS,
	ListView,
	TextInput,
	TouchableHighlight
} = React;	

var dateFormat = {year: 'numeric', month: 'long', day: 'numeric'};
var ds = new ListView.DataSource({
	rowHasChanged: (r1, r2) => r1 != r2
});

class GiraRequestView extends Component{
	constructor(props){
		super(props);

		this.state = {
			currentMessage: '',
			dataSource: ds,
			currentRequestId: props.giraRequest.id
		};
	}

	componentDidMount()
	{
		this.getChatMessages();
	}

	getChatMessages(){
		AzureApi.getAuthInfo((err, authInformation) => {
			AzureApi.getChatMessageList(authInformation, this.state.currentRequestId, (error, data) => {
				this.setState({
					dataSource: this.state.dataSource
						.cloneWithRows(data),
					showProgress: false
				});
			});
		});	
	}

	sendChatMessage(){
		if(this.state.currentMessage != '')
		{
			AzureApi.getAuthInfo((err, authInformation) => {
				AzureApi.insertChatMessage(this.state.currentMessage, this.state.currentRequestId, authInformation, (err, insertedMessage) => {
					if(err){
						AlertIOS.alert(err, [{
							text: 'Ok'
						}]);
					}
					else{
						this.getChatMessages();
					}
				});
			});
		}
	}

	renderRow(rowData)
	{
		var date = new Date(Date.parse(rowData.date));
		var dateAsString = date.toLocaleDateString(this.props.culture, dateFormat);
		var userInfo = (rowData.createdByUserId) ? rowData.createdByUserId.split(':') : undefined;

		var imageUrl =  '';
		if(userInfo[0] == 'Facebook')
		{
			imageUrl = 'https://graph.facebook.com/' + userInfo[1] + '/picture?type=square'
		}
		
		return (
            <View style={styles.rowContainer}>
            	<Image style={styles.thumb} source={{ uri: imageUrl }} />
	            <View  style={styles.textContainer}>
	              <Text style={styles.message}>{rowData.message}</Text>		
	              <View style={styles.detailsContainer}>
		              <Text style={styles.detailsText}>{dateAsString}, {rowData.createdByUserName}</Text>
	              </View>
	            </View>
            </View>
		);	
	}

	render() {
		var item = this.props.giraRequest;
		var date = new Date(Date.parse(item.date));
		var dateAsString = date.toLocaleDateString(this.props.culture, dateFormat);
		var userInfo = (item.createdByUserId) ? item.createdByUserId.split(':') : undefined;
		var timeAsString = 'hele dagen';
		var imageUrl =  '';
		if(userInfo[0] == 'Facebook')
		{
			imageUrl = 'https://graph.facebook.com/' + userInfo[1] + '/picture?type=square'
		}
		if(!item.allDay) {
			var timeFormat = {hour: 'numeric', minute: 'numeric'};
			var startTime = new Date(Date.parse(item.startTime));
			var stopTime = new Date(Date.parse(item.stopTime));
			var timeAsString = startTime.toLocaleTimeString(this.props.culture, timeFormat).replace(/.\d+ /, '').replace('CEST', '') + ' - ' + 
							   stopTime.toLocaleTimeString(this.props.culture, timeFormat).replace(/.\d+ /, '').replace('CEST', '');
		}
		return (
			<View style={styles.container}>
				<View style={styles.heading}>
					<Image style={styles.thumb} source={{ uri: imageUrl }} />
					<Text style={styles.title}>{item.createdByUserName}</Text>
				</View>	
	            <Text style={styles.description}>{item.description}</Text>
	            <Text style={styles.description}>{item.location}</Text>
				<View style={styles.detailsContainer}>
				  <Text style={styles.detailsText}>{dateAsString}, {timeAsString}</Text>
				</View>
				<View style={styles.flowRight}>
				  <TextInput
				    style={styles.commentInput}
				    placeholder='Legg til en melding'
				    onChangeText={(text) => this.setState({currentMessage: text})}/>
				  <TouchableHighlight style={styles.button}
				      underlayColor='#99d9f4'
				      onPress={() => this.sendChatMessage()}>
				    <Text style={styles.buttonText}>Send</Text>
				  </TouchableHighlight>
				</View>
				<ListView
					dataSource={this.state.dataSource}
					renderRow={this.renderRow.bind(this)} />
			</View>		
		);
	}
}

var styles = StyleSheet.create({
  container: {
    marginTop: 65
  },
  heading: {
  	flexDirection: 'row',
    paddingLeft: 5,
    backgroundColor: '#F8F8F8',
    marginBottom: 10,
    height: 45
  },
  separator: {
    height: 1,
    backgroundColor: '#DDDDDD'
  },
  image: {
    width: 400,
    height: 300
  },
  price: {
    fontSize: 25,
    fontWeight: 'bold',
    margin: 5,
    color: '#48BBEC'
  },
  title: {
  	flex: 1,
    fontSize: 18,
    marginTop: 10,
    color: '#656565',
    paddingLeft: 5
  },
  description: {
    fontSize: 18,
    margin: 5,
    color: '#656565'
  },
  detailsText: {
    fontSize: 18,
    margin: 5,
    color: '#656565'
  }, 
  thumb: {
    width: 30,
    height: 30,
    marginRight: 5,
    marginTop: 5,
	borderRadius: 30 / PixelRatio.get(),
  },
flowRight: {
  flexDirection: 'row',
  alignItems: 'center',
  alignSelf: 'stretch'
},
buttonText: {
  fontSize: 18,
  color: 'white',
  alignSelf: 'center'
},
button: {
  height: 36,
  flex: 1,
  flexDirection: 'row',
  backgroundColor: '#48BBEC',
  borderColor: '#48BBEC',
  borderWidth: 1,
  borderRadius: 8,
  marginBottom: 10,
  alignSelf: 'stretch',
  justifyContent: 'center'
},
commentInput: {
  height: 36,
  padding: 4,
  marginRight: 5,
  flex: 4,
  fontSize: 18,
  borderWidth: 1,
  borderColor: '#48BBEC',
  borderRadius: 8,
  color: '#48BBEC'
}
});

module.exports = GiraRequestView;		