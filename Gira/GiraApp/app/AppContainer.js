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

var _giraRequestAddView;

class AppContainer extends Component {
	constructor(props){
		super(props);
		
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
				        initialRoute={YourRouter.getHomeRoute()}
				        style={{ flex: 1 }}
				        sceneStyle={{ paddingTop: 64 }}
				      />
				</TabBarIOS.Item>				
				<TabBarIOS.Item
					title="Legg til Gira"
					selected={this.state.selectedTab == 'addRequest'}
					
					onPress={()=> this.setState({selectedTab: 'addRequest'})}>
						<NavigatorIOS 
							style={{flex:1}}
							initialRoute={{
								component: GiraRequestAddView,
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

let YourRouter = {
  getHomeRoute() {
    return {
      // Return a React component class for the scene. It receives a prop
      // called `navigator` that you can use to push on more routes.
      getSceneClass() {
        return require('./GiraRequestListView');
      },

      // When this scene receives focus, you can run some code. We're just
      // proxying the `didfocus` event that Navigator emits, so refer to
      // Navigator's source code for the semantics.
      onDidFocus(event) {
        console.log('Home Scene received focus.');
      },

      // Return a string to display in the title section of the navigation bar.
      // This route's title is displayed next to the back button when you push
      // a new route on top of this one.
      getTitle() {
        return 'Home';
      },
    };
  }
};

var styles = StyleSheet.create({
});

module.exports = AppContainer;
