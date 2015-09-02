
var React = require('react-native');
var {
	View,
	Text,
	ListView,
	ActivityIndicatorIOS,
	TouchableHighlight,
	StyleSheet
} = React;

var AzureApi = require('./AzureApi');
var GiraRequestView = require('./GiraRequestView');

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
		title: "GiraRequest",
		component: GiraRequestView,
		passProps: {giraRequest: giraRequest}
		});
	}

	renderRow(rowData)
	{
		return (
			<TouchableHighlight onPress={() => this.rowPressed(rowData)}
        		underlayColor='#dddddd'>
	            <View style={{
	                padding: 20,
	                borderColor: '#D7D7D7',
	                borderBottomWidth: 1,
	                backgroundColor: '#fff'
	            }}>
	                <Text style={{
	                    fontSize: 20,
	                    fontWeight: '600'
	                }}>
	                    {rowData.giraTypeRefId}
	                </Text>

	                <View style={{
	                    flex: 1,
	                    flexDirection: 'row',
	                    justifyContent: 'space-between',
	                    marginTop: 20,
	                    marginBottom: 20
	                }}>

	                    <View style={styles.repoCell}>
	                        <Text style={styles.repoCellLabel}>
	                            {rowData.description}
	                        </Text>
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
	  justifyContent: 'center',
	  alignItems: 'center',
	  backgroundColor: '#F5FCFF',
	},
	loader: {
	    marginTop: 20
	},
    repoCell: {
        width: 50,
        alignItems: 'center'
    },
    repoCellIcon: {
        width: 20,
        height: 20
    },
    repoCellLabel: {
        textAlign: 'center'
    }
});

module.exports = GiraRequestListView;