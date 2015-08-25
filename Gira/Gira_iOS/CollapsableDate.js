'use strict';

var React = require('react-native');
var { View, Text, DatePickerIOS } = React;
var t = require('tcomb-form-native');
var Component = t.form.Component;

class CollapsableDate extends Component {

  // this is the only required method to implement
  getTemplate() {
    return function (locals) {

      var stylesheet = locals.stylesheet;
      var formGroupStyle = stylesheet.formGroup.normal;
      var controlLabelStyle = stylesheet.controlLabel.normal;
      var datepickerStyle = stylesheet.datepicker.normal;
      var helpBlockStyle = stylesheet.helpBlock.normal;
      var errorBlockStyle = stylesheet.errorBlock;

      if (locals.hasError) {
        formGroupStyle = stylesheet.formGroup.error;
        controlLabelStyle = stylesheet.controlLabel.error;
        datepickerStyle = stylesheet.datepicker.error;
        helpBlockStyle = stylesheet.helpBlock.error;
      }

      var label = locals.label ? <Text style={controlLabelStyle}>{locals.label}</Text> : null;
      var help = locals.help ? <Text style={helpBlockStyle}>{locals.help}</Text> : null;
      var error = locals.hasError && locals.error ? <Text style={errorBlockStyle}>{locals.error}</Text> : null;

      if(locals.hide) {
        return (
          <View style={formGroupStyle}>
            <Text style={controlLabelStyle}>{locals.value.toLocaleDateString()}</Text>
          </View>
        );
      }
      else {
        return (
        <View style={formGroupStyle}>
          {label}
          <DatePickerIOS
            ref="input"
            maximumDate={locals.maximumDate}
            minimumDate={locals.minimumDate}
            minuteInterval={locals.minuteInterval}
            mode={locals.mode}
            timeZoneOffsetInMinutes={locals.timeZoneOffsetInMinutes}
            style={datepickerStyle}
            onDateChange={(value) => locals.onChange(value)}
            date={locals.value}
          />
          {help}
          {error}
          </View>
        );
      }
    }
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
    locals.hide = this.props.options.hide

    // add here your custom locals

    return locals;
  }

};

module.exports = CollapsableDate;