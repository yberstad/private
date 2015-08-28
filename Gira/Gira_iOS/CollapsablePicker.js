'use strict';

var React = require('react-native');
var { View, Text, TouchableHighlight, PickerIOS, StyleSheet } = React;
var t = require('tcomb-form-native');
var Component = t.form.Component;
class CollapsablePicker extends Component {

  // this is the only required method to implement
  getTemplate() {
    return function (locals) {

      var stylesheet = locals.stylesheet;
      var formGroupStyle = stylesheet.formGroup.normal;
      var controlLabelStyle = stylesheet.controlLabel.normal;
      var selectStyle = stylesheet.select.normal;
      var helpBlockStyle = stylesheet.helpBlock.normal;
      var errorBlockStyle = stylesheet.errorBlock;

      if (locals.hasError) {
        formGroupStyle = stylesheet.formGroup.error;
        controlLabelStyle = stylesheet.controlLabel.error;
        selectStyle = stylesheet.select.error;
        helpBlockStyle = stylesheet.helpBlock.error;
      }

      var label = locals.label ? <Text style={controlLabelStyle}>{locals.label}</Text> : null;
      var help = locals.help ? <Text style={helpBlockStyle}>{locals.help}</Text> : null;
      var error = locals.hasError && locals.error ? <Text style={errorBlockStyle}>{locals.error}</Text> : null;
      var valueAsText = locals.enums.meta.map[locals.value];

      if(locals.hide)
      {
          return(<View></View>);
      }

      if(locals.collapsed){
        return (
          <View style={formGroupStyle}>
            <TouchableHighlight style={styles.button} onPress={() => locals.onToggle(locals.collapsed)} underlayColor="#ffffff">
              <View style={styles.buttonView}>
                  <Text style={styles.buttonLabel}>{locals.label}</Text> 
                  <Text style={styles.buttonDate}>{valueAsText}</Text> 
              </View>
            </TouchableHighlight>
            {help}
            {error}
          </View>
        );
      }
      else {
        var options = locals.options.map(({value, text}) => <PickerIOS.Item key={value} value={value} label={text} />);
        return (
        <View style={formGroupStyle}>
          <TouchableHighlight style={styles.button} onPress={() => locals.onToggle(locals.collapsed)} underlayColor="#ffffff">
            <View style={styles.buttonView}>
                <Text style={styles.buttonLabel}>{locals.label}</Text> 
                <Text style={styles.buttonDate}>{valueAsText}</Text>
            </View>
          </TouchableHighlight>
          <PickerIOS
            ref="input"
            style={selectStyle}
            selectedValue={locals.value}
            onValueChange={locals.onChange}
          >
            {options}
          </PickerIOS>
          {help}
          {error}
          </View>
        );
      }
    }
  }

  getNullOption() {
    return this.props.options.nullOption || {value: '', text: '-'};
  }

  getEnum() {
    return this.typeInfo.innerType;
  }

  getOptionsOfEnum(type) {
  var enums = type.meta.map;
  return Object.keys(enums).map(value => {
    return {
      value,
      text: enums[value]
    };
  });
}

  getOptions() {
    var options = this.props.options;
    var items = options.options ? options.options.slice() : this.getOptionsOfEnum(this.getEnum());
    if (options.order) {
      items.sort(getComparator(options.order));
    }
    var nullOption = this.getNullOption();
    if (options.nullOption !== false) {
      items.unshift(nullOption);
    }
    return items;
  }

  // you can optionally override the default getLocals method
  // it will provide the locals param to your template
  getLocals() {

    // in locals you'll find the default locals:
    // - path
    // - error
    // - hasError
    // - label
    // - onChange
    // - stylesheet
    var locals = super.getLocals();
    locals.options = this.getOptions();
    locals.hide = this.props.options.hide;
    locals.collapsed = this.props.options.collapsed;
    locals.enums = this.getEnum();
    if(this.props.options.onToggle)
    {
      locals.onToggle = this.props.options.onToggle.bind(this);
    }

    // add here your custom locals

    return locals;
  }

};

var styles = StyleSheet.create({
  buttonView: {
    flexDirection: 'row'
  },
  buttonLabel: {
    flex: 1,
    fontSize: 17,
    color: '#000000',
    alignSelf: 'flex-start'
  },
  buttonDate: {
    flex: 2,
    fontSize: 17,
    color: '#000000',
    alignSelf: 'flex-end'
  },
  button: {
    height: 36,
    backgroundColor: '#ffffff',
    borderColor: '#cccccc',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  }
});

module.exports = CollapsablePicker;