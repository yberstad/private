
var React = require('react-native');
var {
	View,
	Text,
	ListView,
	ActivityIndicatorIOS,
	TouchableHiglight,
	StyleSheet
} = React;

var AzureApi = require('./AzureApi');

class GiraRequestList extends React.Component{
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

	renderRow(rowData)
	{
		return (
			<View>
				<Text>
					{rowData.description}
				</Text>
			</View>
		);	
	}

	render(){
		if(this.state.showProgress){
			return(
				<View style={{
					flex: 1,
					justifyContent: 'center'
				}}>
					<ActivityIndicatorIOS
						size="large"
						animating={true} />
				</View>
			);
		}
		return (
			<View style={{
				flex: 1,
				justifyContent: 'center'
			}}>
				<ListView
					dataSource={this.state.dataSource}
					renderRow={this.renderRow.bind(this)} />
			</View>
		);
	}
}

var styles = StyleSheet.create({
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

module.exports = GiraRequestList;