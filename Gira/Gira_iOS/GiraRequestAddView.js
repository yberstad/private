'use strict';

var React = require('react-native');
var t = require('tcomb-form-native');
var collapsableDate = require('./CollapsableDate');
var collapsablePicker = require('./CollapsablePicker');
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
multilineTextBox.textbox.normal.height = 60;
multilineTextBox.textbox.error.height = 60;

var picker = JSON.parse(JSON.stringify(t.form.Form.stylesheet));
picker.select.normal.marginBottom = 1;
picker.select.error.marginBottom = 1;
picker.datepicker.normal.marginBottom = 1;
picker.datepicker.error.marginBottom = 1;

var checkBoxStyle = JSON.parse(JSON.stringify(t.form.Form.stylesheet));
checkBoxStyle.formGroup.normal.flexDirection = 'row';
checkBoxStyle.controlLabel.normal.fontWeight = 'normal';
checkBoxStyle.controlLabel.normal.flex = 4;
checkBoxStyle.checkbox.normal.flex = 1;

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
			error: 'Aktivitet manger',
			collapsed: true,
			factory: collapsablePicker
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
			label: 'Dato',
			mode: 'date',
			stylesheet: picker,
			collapsed: true,
			factory: collapsableDate,
			onToggle: null
		},
		allDay:{
			label: 'Hele dagen',
			value: true,
			stylesheet: checkBoxStyle
		},
		startTime: {
			label: 'Start',
			mode: 'time',
			minuteInterval: '30',
			stylesheet: picker,
			hide: true,
			collapsed: false,
			factory: collapsableDate,
			onToggle: null
		},
		stopTime:{
			label: 'Slutt',
			mode: 'time',
			minuteInterval:'30',
			stylesheet: picker,
			hide: true,
			collapsed: false,
			factory: collapsableDate,
			onToggle: null
		}
	}
};

var GiraRequestAddView = React.createClass({
	getInitialState: function() {
		return {
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
	},

	componentWillMount: function(){
		this.state.options.fields.date.onToggle = this.onToggle;
		this.state.options.fields.giraTypeRefId.onToggle = this.onToggleGiraRef;
	},

	onToggleGiraRef: function(toggleValue){
		var options = t.update(this.state.options, {
	      fields: {
	        giraTypeRefId: {
	          collapsed: {'$set': !toggleValue}
	        }
	      }
	    });
	    this.setState({options: options});
	},

	onToggle: function(toggleValue){
		var options = t.update(this.state.options, {
	      fields: {
	        date: {
	          collapsed: {'$set': !toggleValue}
	        }
	      }
	    });
	    this.setState({options: options});
	},

	onChange: function(value){
		var options = t.update(this.state.options, {
	      fields: {
	        startTime: {
	          hide: {'$set': value.allDay}
	        },
	        stopTime: {
	          hide: {'$set': value.allDay}
	        }
	      }
	    });
	    this.setState({options: options, value: value});
	},

	insertItem: function()
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
	},


	render: function(){
		return (
			<ScrollView>
				<View style={styles.container}>
				  <Form
				    ref="form"
				    type={GiraRequestInput}
				    options={this.state.options}
				    value={this.state.value}
				    onChange={this.onChange}
				    />
				</View>
			</ScrollView>
		);
	}


});

var styles = React.StyleSheet.create({
    container: {
	    justifyContent: 'center',
	    marginTop: 10,
	    padding: 5,
	    backgroundColor: '#ffffff'
    }
});

module.exports = GiraRequestAddView;