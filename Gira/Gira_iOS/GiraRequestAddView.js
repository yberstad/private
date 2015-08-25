'use strict';

var React = require('react-native');
var t = require('tcomb-form-native');
var collapsableDate = require('./CollapsableDate');
var AzureApi = require('./AzureApi');

var {
	View,
	Text,
	TextInput,
	Component,
	AllertIOS,
	ScrollView,
} = React;

var Form = t.form.Form;

var multilineTextBox = JSON.parse(JSON.stringify(t.form.Form.stylesheet));
multilineTextBox.textbox.normal.height = 100;
multilineTextBox.textbox.error.height = 100;

var picker = JSON.parse(JSON.stringify(t.form.Form.stylesheet));
picker.select.normal.marginBottom = 1;
picker.select.error.marginBottom = 1;
picker.datepicker.normal.marginBottom = 1;
picker.datepicker.error.marginBottom = 1;

var GiraRequestType = t.enums({
	'' : 'Velg aktivitet',
  '2fa7186245c74643872830b832271564': 'Klatre inne',
  '3fa7186245c74643872830b832271564': 'Klatre ute',
  '4fa7186245c74643872830b832271564': 'Ut på tur',
  '5fa7186245c74643872830b832271564': 'Trad',
  '6fa7186245c74643872830b832271564': 'Sport',
  '7fa7186245c74643872830b832271564': 'Buldre'

});

var GiraRequestInput = t.struct({
	giraTypeRefId: GiraRequestType,
	location: t.Str,
	description: t.maybe(t.Str),
	date: t.Dat,
	allDay: t.Bool,
	startTime: t.maybe(t.Dat),
	stopTime: t.maybe(t.Dat)
});

var options = {
	auto: 'none',
	fields:{
		giraTypeRefId:{
			nullOption: false,
			error: 'Aktivitet manger'
		},
		description: {
			placeholder: 'Beskrivelse',
			multiline: true,
			stylesheet: multilineTextBox
		},
		location: {
			placeholder: 'Sted',
			error: 'Sted mangler'
		},
		date:{
			mode: 'date',
			stylesheet: picker
		},
		allDay:{
			label: 'Hele dagen',
			value: true
		},
		startTime: {
			label: 'Start tidspunkt',
			mode: 'time',
			minuteInterval:"30",
			stylesheet: picker
		},
		stopTime:{
			label: 'Slutt tidpunkt',
			mode: 'time',
			minuteInterval:"30",
			stylesheet: picker
		}
	}
}

class GiraRequestAddView extends Component {
	constructor(props){
		super(props);
		this.state = {
	      options: options,
	      value: {
	        giraTypeRefId: '',
	        description: '',
	        location: '',
	        date: new Date(),
	        allDay: true,
	        startTime: new Date(),
	        stopTime: new Date(),
	      }
	    };
	}

	insertItem()
	{
		AzureApi.getAuthInfo((err, authInformation) => {
			var value = this.refs.form.getValue();
			if(value){
				AzureApi.insertGiraRequest(value, authInformation, (error, insertedItem) =>{
					if(error)
					{
						AlertIOS.alert(err,
							[{ 
								text: 'OK',
								onPress: () => console.log('Tapped OK'),
							 },
							 {
								text: 'Avbryt',
								onPress: () => {
								  	console.log('Tapped Cancel');
								  	this.props.navigator.pop();
								  },
							 }]
						);
					}
					else{
						this.props.navigator.pop();
					}
				});
			}
		});
	}


	render(){
		return (
			<ScrollView>
				<View style={styles.container}>
				  <Form
				    ref="form"
				    type={GiraRequestInput}
				    options={this.state.options}
				    value={this.state.value}
				    />
				</View>
			</ScrollView>
		);
	}


}

var styles = React.StyleSheet.create({
    container: {
	    justifyContent: 'center',
	    marginTop: -80,
	    padding: 5,
	    backgroundColor: '#ffffff'
    }
});

module.exports = GiraRequestAddView;