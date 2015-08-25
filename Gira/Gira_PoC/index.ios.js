/**
* Sample React Native App
* https://github.com/facebook/react-native
* 
* @see https://github.com/gcanti/tcomb-form-native
*/

var React = require('react-native');
var t = require('tcomb-form-native');
var customDatePicker = require('./hideableDatePicker')

var {
  AppRegistry,
  StyleSheet,
  TouchableHighlight,
  ScrollView,
  Text,
  TextInput,
  View,
  DatePickerIOS,
} = React;

var Form = t.form.Form;

var defaultStyleSheet = JSON.parse(JSON.stringify(t.form.Form.stylesheet));
defaultStyleSheet.textbox.normal.height = 100;
defaultStyleSheet.textbox.error.height = 100;

var GiraType = t.enums({
  '2fa7186245c74643872830b832271564': 'Klatre inne',
  '3fa7186245c74643872830b832271564': 'Klatre ute'
});

// here we are: define your domain model
var Person = t.struct({
  name: t.Str,              // a required string
  surname: t.Str,  // an optional string
  email: t.Str,  // an optional string
  age: t.Num,               // a required number
  rememberMe: t.Bool,        // a boolean
  birthDate: t.maybe(t.Dat), // a date field
  giraType: GiraType
});

var options = {
  auto: 'none',
  fields: {
    name: {
      placeholder: 'Navn'
    },
    surname:{
      placeholder: 'Beskrivelse2',
      multiline: 'true',
      stylesheet: defaultStyleSheet,
    },
    birthDate : {
      label: 'Start dato',
      mode:"time",
      minuteInterval:"30",
      hide: true,
      factory: customDatePicker
    },
    rememberMe: {
      value: true
    }
  }
}; // optional rendering options (see documentation)



var Gira_PoC = React.createClass({

  getInitialState: function() {
    return {
      options: options,
      value: {
        name: '',
        surname: '',
        birthDate: new Date(),
        rememberMe: true
      }
    };
  },

  onChange(value) {
    // tcomb immutability helpers
    // https://github.com/gcanti/tcomb/blob/master/GUIDE.md#updating-immutable-instances
    var options = t.update(this.state.options, {
      fields: {
        birthDate: {
          hide: {'$set': value.rememberMe}
        },
        rememberMe:{
          value: {'$set': value.rememberMe}
        }
      }
    });
    this.setState({options: options, value: value});
  },  

  onPress: function () {
    // call getValue() to get the values of the form
    var value = this.refs.form.getValue();
    if (value) { // if validation fails, value will be null
      alert(JSON.stringify(value)); // value here is an instance of Person
    }
  },

  render: function() {
    return (
      <ScrollView>
        <View style={styles.container}>
          {/* display */}
          <Form
            ref="form"
            type={Person}
            options={this.state.options}
            value={this.state.value}
            onChange={this.onChange}
            />
          <TouchableHighlight style={styles.button} onPress={this.onPress} underlayColor='#99d9f4'>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableHighlight>
        </View>
      </ScrollView>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    marginTop: 50,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 30,
    alignSelf: 'center',
    marginBottom: 30
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center'
  },
  button: {
    height: 36,
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  }
});

AppRegistry.registerComponent('Gira_PoC', () => Gira_PoC);
