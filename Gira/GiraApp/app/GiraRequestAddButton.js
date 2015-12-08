'use strict';

var React = require('react-native');
import ExNavigator from '@exponent/react-native-navigator';

var {
  TouchableOpacity,
  Text
} = React;

class AddRequestButton extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = { isEditing: false };
  }
  
  render() {
    return(
      <TouchableOpacity
        touchRetentionOffset={ExNavigator.Styles.barButtonTouchRetentionOffset}
        onPress={this._handlePress.bind(this)}
        style={ExNavigator.Styles.barRightButton}>
        <Text style={ExNavigator.Styles.barRightButtonText}>
          {this.state.isEditing ? 'Done' : 'Add'}
        </Text>
      </TouchableOpacity>
    );
  }

  _handlePress() {
    let shouldBeEditing = !this.state.isEditing;
    this.setState({ isEditing: shouldBeEditing });
    // Communicate with other components with the event emitter
    this.props.routeEvents.emit('editing', shouldBeEditing, this.props.parent);
  }

  // To receive events, add a listener in componentDidMount and remove it in
  // componentWillUnmount.
}

module.exports = AddRequestButton;