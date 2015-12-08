'use strict';

var React = require('react-native');
import ExNavigator from '@exponent/react-native-navigator';


var {
	Text,
	View,
	Component,
	StyleSheet,
	TabBarIOS,
	NavigatorIOS
} = React;

var GiraRequestListView = require('./GiraRequestListView');
var GiraRequestAddView = require('./GiraRequestAddView');
var AddGiraRequestModal = require('./TopModal.js');
var AppRouter = require('./Router.js');
//var EventEmitter = require('EventEmitter');

var _giraRequestAddView;

class AppContainer extends Component {
	constructor(props){
		super(props);
		
		this.state = {
			selectedTab: 'requestlist',
			modalAddViewShow: false
		}
	}

	/*componentWillMount()
	{
		this.eventEmitter = new EventEmitter();
		this.eventEmitter.on('editing', this.goToAddView)
	}

	goToAddView()
	{

	}*/

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

	navigateToView(){
		this.refs.startingPoint.push({
			backButtonTitle: 'Tilbake',
			title: "Ny Aktivitet",
			component: GiraRequestAddView,
			rightButtonTitle: 'Lagre',
			passProps: {
				ref: this.onGiraRequestAddViewRef,
				culture: this.props.culture,
				giraRequestType : this.props.giraRequestType
			},
			onRightButtonPress: () => { _giraRequestAddView && _giraRequestAddView.insertItem(); }
		});
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
				     <ExNavigator
				        initialRoute={AppRouter.getGiraRequestListView(this.props.culture, this.props.giraRequestType)}
				        style={{ flex: 1 }}
				        sceneStyle={{ paddingTop: 64 }}
				      />
				</TabBarIOS.Item>				
				<TabBarIOS.Item
					title="Legg til Gira"
					selected={this.state.selectedTab == 'addRequest'}
					onPress={()=> this.setState({selectedTab: 'addRequest', modalAddViewShow: true})}>
					    {this.state.modalAddViewShow ? <AddGiraRequestModal closeModal={() => this.setState({selectedTab: 'requestlist', modalAddViewShow: false})}/> : null }
					</TabBarIOS.Item>
			</TabBarIOS>
		); 
	}
}

var styles = StyleSheet.create({
});

module.exports = AppContainer;
