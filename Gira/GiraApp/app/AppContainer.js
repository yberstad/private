'use strict';

var React = require('react-native');
import ExNavigator from '@exponent/react-native-navigator';
var ActionButton = require('react-native-action-button');
var Icon = require('react-native-vector-icons/Ionicons');

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

	navigateToView2(){
		this.setState({ modalAddViewShow: false}); 
		this.refs.navigator.push(AppRouter.getAddGiraRequestView(this.props.culture, this.props.giraRequestType));
	}

	render()
	{
		return (
			<View style={{flex:1, backgroundColor: '#f3f3f3'}}>
		       <ExNavigator
		       		ref="navigator"
		  	        initialRoute={AppRouter.getGiraRequestListView(this.props.culture, this.props.giraRequestType)}
		  	        style={{ flex: 1}}
		  	        
		  	      />
		  	      {this.state.modalAddViewShow ? <AddGiraRequestModal closeModal={() => this.setState({ modalAddViewShow: false})}/> : null }

			  <ActionButton buttonColor="rgba(231,76,60,1)">
			    <ActionButton.Item buttonColor='#9b59b6' title="New Task" onPress={() => this.navigateToView2()}>
			      <Icon name="android-create" style={styles.actionButtonIcon} />
			    </ActionButton.Item>
			    <ActionButton.Item buttonColor='#3498db' title="Notifications" onPress={() => {}}>
			      <Icon name="android-notifications-none" style={styles.actionButtonIcon} />
			    </ActionButton.Item>
			    <ActionButton.Item buttonColor='#1abc9c' title="All Tasks" onPress={() => {}}>
			      <Icon name="android-done-all" style={styles.actionButtonIcon} />
			    </ActionButton.Item>
			  </ActionButton>
			</View>
/*			<TabBarIOS style={styles.container}>
				<TabBarIOS.Item
					title="Gira liste"
					selected={this.state.selectedTab == 'requestlist'}	
					onPress={() => this.setState({selectedTab: 'requestlist', modalAddViewShow: false})}
				>
					<View style={styles.container}>
						</View>
				</TabBarIOS.Item>				
				<TabBarIOS.Item
					title="Legg til Gira"
					selected={this.state.selectedTab == 'addRequest'}
					onPress={()=> this.setState({ modalAddViewShow: true})}>
					</TabBarIOS.Item>
			</TabBarIOS>
*/
		); 
	}
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
});

module.exports = AppContainer;
