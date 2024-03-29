'use strict';

var React = require('react-native');
var t = require('tcomb-form-native');
var collapsableDate = require('./CollapsableDate');
var collapsablePicker = require('./CollapsablePicker');
var AzureApi = require('./AzureApi');
var FormStylesheet = require('./FormStylesheet');

var {
	View,
	Text,
	TextInput,
	Component,
	AllertIOS,
	ScrollView,
	Image,
	Dimensions
} = React;

var windowSize = Dimensions.get('window');

var Form = t.form.Form;
Form.stylesheet = FormStylesheet;

var multilineTextBox = JSON.parse(JSON.stringify(t.form.Form.stylesheet));

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

var GiraRequestInput;

var options = {
	auto: 'none',
	fields:{
		giraTypeRefId:{
			label: 'Aktivitet',
			nullOption: {value: '', text: 'Velg aktvietet'},
			collapsed: true,
			factory: collapsablePicker,
			error: 'Aktivitet manger',
		},
		description: {
			placeholder: 'Beskrivelse',
			error: 'Beskrivelse mangler',
			placeholderTextColor: '#858591',
		},
		location: {
			placeholder: 'Sted, Område, Klatrefelt',
			error: 'Sted mangler',
			placeholderTextColor: '#858591',
		},
		date:{
			label: 'Dato',
			mode: 'date',
			stylesheet: picker,
			collapsed: true,
			factory: collapsableDate,
			onToggle: null,
			culture: 'nb-NO'
		},
		allDay:{
			label: 'Hele dagen',
			value: true,
			stylesheet: checkBoxStyle,
			thumbTintColor: '#BEBEC1',
			onTintColor: '#DDDDE6'
		},
		startTime: {
			label: 'Start',
			mode: 'time',
			minuteInterval: 30,
			stylesheet: picker,
			hide: true,
			collapsed: true,
			factory: collapsableDate,
			onToggle: null,
			culture: 'nb-NO'
		},
		stopTime:{
			label: 'Slutt',
			mode: 'time',
			minuteInterval: 30,
			stylesheet: picker,
			hide: true,
			collapsed: true,
			factory: collapsableDate,
			onToggle: null,
			culture: 'nb-NO'
		}
	}
};

var GiraRequestAddView = React.createClass({
	getInitialState: function() {
		var date = new Date();
		date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours()+1, 0, 0, 0);
		return {
	      options: options,
	      value: {
	        giraTypeRefId: '',
	        description: '',
	        location: '',
	        date: date,
	        allDay: true,
	        startTime: date,
	        stopTime: date,
	      }
	    };
	},

	componentWillMount: function(){
		this.state.options.fields.giraTypeRefId.onToggle = this.onToggleGiraRef;
		this.state.options.fields.date.onToggle = this.onToggleDate;
		this.state.options.fields.startTime.onToggle = this.onToggleStart;
		this.state.options.fields.stopTime.onToggle = this.onToggleStop;
		this.state.options.fields.description.onFocus = this.onFocusTextbox;
		this.state.options.fields.location.onFocus = this.onFocusTextbox;

		this.state.options.fields.date.culture = this.props.culture;
		this.state.options.fields.startTime.culture = this.props.culture;
		this.state.options.fields.stopTime.culture = this.props.culture;

		var optionList = {};
		this.props.giraRequestType.forEach(({id, name}) => {
		   optionList[id] = name;
		});

		GiraRequestInput = t.struct({
			giraTypeRefId: t.enums(optionList),
			description: t.maybe(t.Str),
			location: t.maybe(t.Str),
			date: t.Dat,
			allDay: t.Bool,
			startTime: t.maybe(t.Dat),
			stopTime: t.maybe(t.Dat)
		});
	},

	onFocusTextbox: function(){
		var options = t.update(this.state.options, {
	      fields: {
	        giraTypeRefId: {
	          collapsed: {'$set': true}
	        },
	       	date: {
	          collapsed: {'$set': true}
	        },
	        startTime: {
	          collapsed: {'$set': true}
	        },
	        stopTime: {
	          collapsed: {'$set': true}
	        }
	      }
	    });
	    this.setState({options: options});
	},

	onToggleGiraRef: function(toggleValue){
		var options = t.update(this.state.options, {
	      fields: {
	        giraTypeRefId: {
	          collapsed: {'$set': !toggleValue}
	        },
	       	date: {
	          collapsed: {'$set': true}
	        },
	        startTime: {
	          collapsed: {'$set': true}
	        },
	        stopTime: {
	          collapsed: {'$set': true}
	        }	        
	      }
	    });
	    this.setState({options: options});
	},

	onToggleDate: function(toggleValue){
		var options = t.update(this.state.options, {
	      fields: {
	        date: {
	          collapsed: {'$set': !toggleValue}
	        },
	        giraTypeRefId: {
	          collapsed: {'$set': true}
	        },
	        startTime: {
	          collapsed: {'$set': true}
	        },
	        stopTime: {
	          collapsed: {'$set': true}
	        },
	      }
	    });
	    this.setState({options: options});
	},

	onToggleStart: function(toggleValue){
		var options = t.update(this.state.options, {
	      fields: {
	        startTime: {
	          collapsed: {'$set': !toggleValue}
	        },
	        giraTypeRefId: {
	          collapsed: {'$set': true}
	        },
	       	date: {
	          collapsed: {'$set': true}
	        },
	        stopTime: {
	          collapsed: {'$set': true}
	        }	        
	      }
	    });
	    this.setState({options: options});
	},

	onToggleStop: function(toggleValue){
		var options = t.update(this.state.options, {
	      fields: {
	        stopTime: {
	          collapsed: {'$set': !toggleValue}
	        },
	        giraTypeRefId: {
	          collapsed: {'$set': true}
	        },
	       	date: {
	          collapsed: {'$set': true}
	        },
	        startTime: {
	          collapsed: {'$set': true}
	        },	        
	      }
	    });
	    this.setState({options: options});
	},

	onChange: function(value, path){
		if(path[0] == 'date')
		{
			value.startTime = new Date(value.date.getFullYear(), 
									   value.date.getMonth(), 
									   value.date.getDate(), 
									   value.startTime.getHours(), 
									   value.startTime.getMinutes(), 0, 0);	

			value.stopTime = new Date(value.date.getFullYear(), 
									   value.date.getMonth(), 
									   value.date.getDate(), 
									   value.stopTime.getHours(), 
									   value.stopTime.getMinutes(), 0, 0);										   		
		}
		if(value.stopTime <= value.startTime)
		{
			value.stopTime = new Date(value.stopTime.getFullYear(), 
									  value.stopTime.getMonth(), 
									  value.stopTime.getDate(), 
									  value.startTime.getHours(), 
									  value.startTime.getMinutes() + 30, 0, 0);
		}
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
			<View style={styles.container}>
				<View style={styles.header}>
					<Image source={require('image!modalheader')} style={styles.bg}/>
				</View>
				<ScrollView style={styles.body}>
					<Form
						ref="form"
						type={GiraRequestInput}
						options={this.state.options}
						value={this.state.value}
						onChange={this.onChange}
						/>
					<TextInput ref='DummyInput' style={styles.hidden}/>

				</ScrollView>
			</View>
		);
	}


});

var styles = React.StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column'
    },
    header: {
      flex: .2
    },
    body: {
      flex: .8
    },
    scrollContainer: {
	    justifyContent: 'center',
	    marginTop: 10,
	    padding: 5,
	    backgroundColor: '#ffffff'
    },
    bg: {
      position: 'absolute',
      left: 0,
      right: 0,
      width: windowSize.width,
      height:100,
      flex: 1
    },
    hidden:{
    	opacity: 0
    }
});

module.exports = GiraRequestAddView;