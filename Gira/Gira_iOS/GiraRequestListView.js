
var React = require('react-native');
var {
	View,
	Text,
	ListView,
	ActivityIndicatorIOS,
	TouchableHighlight,
	StyleSheet,
	Image,
	PixelRatio
} = React;

var AzureApi = require('./AzureApi');
var GiraRequestView = require('./GiraRequestView');
var dateFormat = {year: 'numeric', month: 'long', day: 'numeric'};

class GiraRequestListView extends React.Component{
	constructor(props){
		super(props);
		var ds = new ListView.DataSource({
			rowHasChanged: (r1, r2) => r1 != r2
		});

		this.state = {
			authInfo: '',
			dataSource: ds,
			showProgress: true
		};
	}
	
	componentDidMount()
	{
		this.doSearch();
	}

	doSearch()
	{
		AzureApi.getAuthInfo((err, authInformation) => {
			AzureApi.getGiraRequestList(authInformation, (error, data) => {
				this.setState({
					dataSource: this.state.dataSource
						.cloneWithRows(data),
					showProgress: false
				});
			});
		});	


	}

	rowPressed(giraRequest) {
		this.props.navigator.push({
		title: giraRequest.giraTypeName,
		component: GiraRequestView,
		passProps: {
			giraRequest: giraRequest,
			culture: this.props.culture
		}
		});
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
			<TouchableHighlight onPress={() => this.rowPressed(rowData)}
        		underlayColor='#dddddd'>
	            <View style={styles.rowContainer}>
	            	<Image style={styles.thumb} source={{ uri: imageUrl }} />
		            <View  style={styles.textContainer}>
		              <Text style={styles.title}>{rowData.giraTypeName}</Text>		
		              <Text style={styles.description} numberOfLines={1}>{rowData.description}</Text>
		              <View style={styles.detailsContainer}>
			              <Text style={styles.detailsText}>{dateAsString}, {rowData.createdByUserName}</Text>
		              </View>
		            </View>
	            </View>
			</TouchableHighlight>
		);	
	}

	render(){
		if(this.state.showProgress){
			return(
				<View style={styles.container}>
					<ActivityIndicatorIOS
						size="large"
						animating={true}
						style={styles.loader} />
				</View>
			);
		}
		return (
			<View style={styles.container}>
				<ListView
					dataSource={this.state.dataSource}
					renderRow={this.renderRow.bind(this)} />
			</View>
		);
	}
}

var styles = StyleSheet.create({
	container: {
		    flex: 1,
		    flexDirection: 'row',
		    backgroundColor: '#F5FCFF',
	},
	loader: {
	    marginTop: 20
	},
    textContainer: {
      flex: 1,
      paddingLeft: 5
    },
    detailsContainer: {
    	flex: 1,
      	flexDirection: 'row'
    },
    description: {
		fontSize: 12,
		color: '#656565',
		paddingLeft: 5
    },
    title: {
    	flex: 2,
		fontSize: 16,
		color: '#656565'
    },
    detailsText: {
    	flex: 1,
		fontSize: 10,
		color: '#656565',
		paddingLeft: 5
    },
    rowContainer: {
    	flex: 1,
    	flexDirection: 'row',
      padding: 10,
      backgroundColor: '#fff',
      borderColor: '#D7D7D7',
	  borderBottomWidth: 1
    },
    thumb: {
	    width: 30,
	    height: 30,
	    marginRight: 5,
	    marginTop: 5,
		borderRadius: 30 / PixelRatio.get(),
  },      
});

module.exports = GiraRequestListView;