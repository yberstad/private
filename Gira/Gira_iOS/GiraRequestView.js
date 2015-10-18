'use strict';

var React = require('react-native');

var {
	Text,
	View,
	Component,
	StyleSheet,
	PixelRatio,
	Image
} = React;	

var dateFormat = {year: 'numeric', month: 'long', day: 'numeric'};

class GiraRequestView extends Component{
	constructor(props){
		super(props)
	}

	render() {
		var item = this.props.giraRequest;
		var date = new Date(Date.parse(item.date));
		var dateAsString = date.toLocaleDateString(this.props.culture, dateFormat);
		var userInfo = (item.createdByUserId) ? item.createdByUserId.split(':') : undefined;
		var timeAsString = 'hele dagen';
		var imageUrl =  '';
		if(userInfo[0] == 'Facebook')
		{
			imageUrl = 'https://graph.facebook.com/' + userInfo[1] + '/picture?type=square'
		}
		if(!item.allDay) {
			var timeFormat = {hour: 'numeric', minute: 'numeric'};
			var startTime = new Date(Date.parse(item.startTime));
			var stopTime = new Date(Date.parse(item.stopTime));
			var timeAsString = startTime.toLocaleTimeString(this.props.culture, timeFormat).replace(/.\d+ /, '').replace('CEST', '') + ' - ' + 
							   stopTime.toLocaleTimeString(this.props.culture, timeFormat).replace(/.\d+ /, '').replace('CEST', '');
		}
		return (
			<View style={styles.container}>
				<View style={styles.heading}>
					<Image style={styles.thumb} source={{ uri: imageUrl }} />
					<Text style={styles.title}>{item.createdByUserName}</Text>
				</View>	
	            <Text style={styles.description}>{item.description}</Text>
	            <Text style={styles.description}>{item.location}</Text>
				<View style={styles.detailsContainer}>
				  <Text style={styles.detailsText}>{dateAsString}, {timeAsString}</Text>
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
  	flexDirection: 'row',
    paddingLeft: 5,
    backgroundColor: '#F8F8F8',
    marginBottom: 10,
    height: 45
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
  	flex: 1,
    fontSize: 18,
    marginTop: 10,
    color: '#656565',
    paddingLeft: 5
  },
  description: {
    fontSize: 18,
    margin: 5,
    color: '#656565'
  },
  detailsText: {
    fontSize: 18,
    margin: 5,
    color: '#656565'
  },
  thumb: {
    width: 30,
    height: 30,
    marginRight: 5,
    marginTop: 5,
	borderRadius: 30 / PixelRatio.get(),
  },
});

module.exports = GiraRequestView;