'use strict';

var React = require('react-native');

var {
	Text,
	View,
	Component,
	StyleSheet,
	TabBarIOS,
	NavigatorIOS
} = React;

var GiraRequestList = require('./GiraRequestListView');
var GiraRequestAdd = require('./GiraRequestAddView');

var _giraRequestAddView;

class AppContainer extends Component {
	constructor(props){
		super(props);
		
		this._giraRequestAddView = {};
		this.state = {
			selectedTab: 'requestlist'
		}
	}

	onGiraRequestAddViewRef(giraRequestAddViewRef)
	{
		_giraRequestAddView = giraRequestAddViewRef;
	}

	navigateToTab(tabName){
		this.refs.startingPoint.popToTop();
		this.setState({
			selectedTab: tabName
		})
	}

	render()
	{
		return (
			<TabBarIOS style={styles.container}>
				<TabBarIOS.Item
					title="Gira liste"
					selected={this.state.selectedTab == 'requestlist'}
					
					onPress={() => this.setState({selectedTab: 'requestlist'})}
				>
					<NavigatorIOS
						ref="startingPoint"
						style={{flex: 1}}
						initialRoute={{
							component: GiraRequestList,
							title: 'Gira !'
						}}
					/>
				</TabBarIOS.Item>				
				<TabBarIOS.Item
					title="Legg til Gira"
					selected={this.state.selectedTab == 'addRequest'}
					
					onPress={()=> this.setState({selectedTab: 'addRequest'})}>
						<NavigatorIOS 
							style={{flex:1}}
							initialRoute={{
								component: GiraRequestAdd,
								title: 'Legg til Gira',
								leftButtonTitle: 'Avbryt',
								onLeftButtonPress: () => {this.navigateToTab('requestlist');},
								rightButtonTitle: 'Lagre',
								passProps: {
									ref: this.onGiraRequestAddViewRef,
								},
								onRightButtonPress: () => { _giraRequestAddView && _giraRequestAddView.insertItem(); }
							}}
						/>
					</TabBarIOS.Item>
			</TabBarIOS>
		);
	}
}

var styles = StyleSheet.create({
});

module.exports = AppContainer;
