'use strict';

var React = require('react-native');
var Collapsible = require('react-native-collapsible');
var Animatable = require('react-native-animatable');
var { View, Text, TouchableOpacity, DatePickerIOS, StyleSheet } = React;
var t = require('tcomb-form-native');
var DatePicker = t.form.DatePicker;
class CollapsableDate extends DatePicker {

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

      var dateFormat = {year: 'numeric', month: 'long', day: 'numeric'};
      var timeFormat = {hour: 'numeric', minute: 'numeric'};

      var label = locals.label ? <Text style={controlLabelStyle}>{locals.label}</Text> : null;
      var help = locals.help ? <Text style={helpBlockStyle}>{locals.help}</Text> : null;
      var error = locals.hasError && locals.error ? <Text style={errorBlockStyle}>{locals.error}</Text> : null;
      var dateOrTimeAsString = '';
      if(locals.mode == 'time')
      {
        // Could not get "locals.value.toLocaleTimeString(locals.culture, timeFormat)" to work...
        var pad = '00'
        var hours = locals.value.getHours() + '';
        var minutes = locals.value.getMinutes() + '';
        dateOrTimeAsString = pad.substring(hours.length) + hours  + ':' + pad.substring(minutes.length) + minutes;
      } 
      else{
        dateOrTimeAsString = locals.value.toLocaleDateString(locals.culture, dateFormat);
      }

      if(locals.hide)
      {
          return(<View></View>);
      }
      return (
      <View style={formGroupStyle}>
        <TouchableOpacity onPress={() => {
                if(locals.onToggle){
                  locals.onToggle(locals.collapsed);
                }
              }
            } 
            underlayColor="#ffffff">
          <View style={styles.buttonView}>
              <Text style={[controlLabelStyle, styles.buttonLabel]}>{locals.label}</Text> 
              <Text style={[stylesheet.textbox.inputfont, styles.buttonDate]}>{dateOrTimeAsString}</Text>
          </View>       
          <Collapsible collapsed={locals.collapsed}>
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
          </Collapsible>
        </TouchableOpacity>
        {help}
        {error}
        </View>
      );
    }
  }

  // you can optionally override the default getLocals method
  // it will provide the locals param to your template
  getLocals() {
    var locals = super.getLocals();
    locals.hide = this.props.options.hide;
    locals.collapsed = this.props.options.collapsed;
    locals.culture = this.props.options.culture; 
    if(this.props.options.onToggle)
    {
      locals.onToggle = this.props.options.onToggle.bind(this);
    }

    return locals;
  }

};

var styles = StyleSheet.create({
  buttonView: {
    flexDirection: 'row',
    height: 36
  },
  buttonLabel: {
    flex: 1,
    alignSelf: 'center',
    marginBottom: 0
  },
  buttonDate: {
    flex: 1,
    alignSelf: 'center',
    marginBottom: 0
  }
});

module.exports = CollapsableDate;