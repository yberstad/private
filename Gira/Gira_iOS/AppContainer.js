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

var GiraRequestList = require('./GiraRequestList');
var GiraRequestAdd = require('./GiraRequestAdd');

class AppContainer extends Component {
	constructor(props){
		super(props);

		this.state = {
			selectedTab: 'requestlist'
		}
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
								title: 'Legg til Gira'
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
