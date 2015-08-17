'use strict';

var React = require('react-native');

var {
	Text,
	View,
	Component,
	StyleSheet
} = React;	


class GiraRequestView extends Component{
	constructor(props){
		super(props)
	}

	render() {
		return (
			<View style={styles.container}>
				<View style={styles.heading}>
					<Text style={styles.title}>
						{this.props.giraRequest.description}
					</Text>
				</View>
			</View>
		);
	}
}

var styles = StyleSheet.create({
  container: {
    marginTop: 65
  },
  heading: {
    backgroundColor: '#F8F8F8',
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
    fontSize: 20,
    margin: 5,
    color: '#656565'
  },
  description: {
    fontSize: 18,
    margin: 5,
    color: '#656565'
  }
});

module.exports = GiraRequestView;