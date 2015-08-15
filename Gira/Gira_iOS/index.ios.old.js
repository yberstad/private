/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
/*
'use strict';

import api from './azure-api.js';
var Api2 = require('./azure-api.js');


var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  DatePickerIOS,
  TextInput,
  ScrollView,
} = React;

var AzureManager = require('NativeModules').AzureMSClient;

var Gira_iOS = React.createClass({

  getDefaultProps() {
    return {
      date: new Date(),
      timeZoneOffsetInHours: (-1) * (new Date()).getTimezoneOffset() / 60,
    };
  },

  getInitialState() {
    return {
      result: '...',
      userid: 'user_id',
      azureToken : 'azureToken',
      data: '',
      isLoading: false,
      message: '',
      date: this.props.date,
      timeZoneOffsetInHours: this.props.timeZoneOffsetInHours,
      giraRequests: '',
    }
  },

  onDateChange(date) {
    this.setState({date: date});
  },

  onTimezoneChange(event) {
    var offset = parseInt(event.nativeEvent.text, 10);
    if (isNaN(offset)) {
      return;
    }
    this.setState({timeZoneOffsetInHours: offset});
  },

  login(){
    AzureManager.loginWithProvider("facebook",  (error, info) => {
      if (error) {
        this.setState({result: error});
      } else {
        this.setState({result: info});
        this.setState({userid: info.userId, azureToken: info.token})
      }
    });
  },
  getGiraRequests()
  {
    api.getGiraRequestList(this.state.token, (error, json) =>{
      if(error)
      {
        this.set({result: error});
      }
      else{
        this.setState({giraRequests: json});
      }
    })
  },

  readDataWithFetch()
  {
    fetch('https://giramobileservice.azure-mobile.net/tables/GiraRequest', {
      method: 'get',
      headers: {
        "Host": "giramobileservice.azure-mobile.net",
        "Content-Type": "application/json",
        "ACCEPT": "application/json",
        "X-ZUMO-APPLICATION": "eXVPAWPzwWRkMbTgjqmolczVUtfpyo18",
        "X-ZUMO-AUTH": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ1cm46bWljcm9zb2Z0OndpbmRvd3MtYXp1cmU6enVtbyIsImF1ZCI6InVybjptaWNyb3NvZnQ6d2luZG93cy1henVyZTp6dW1vIiwibmJmIjoxNDM4NzIyMzAzLCJleHAiOjE0NDEzMTQzMDMsInVybjptaWNyb3NvZnQ6Y3JlZGVudGlhbHMiOiJ7XCJhY2Nlc3NUb2tlblwiOlwiQ0FBR1RXVmZockl3QkFQOVJaQm5TOEFXYVpDNnpoVmdWQURVWFZhNzV1cXFTU2tPbnQ2dUlTYU9HNzlaQ0FRRjhUZTJ1NDhMQzVtZnVLeWlpT0ppMm5oTjhjWkJ0UUlFNnRmSmtqS1pDYzdOZHNORU5VVlVxZjVsSVpBdmJwenVQM2xpeW5IZjVOWDZGVXI5SVFzNlZJWFFnRnh3YlZGa2libXNEc3VaQTBxZXBZU1pBNDBJVVpBYWl0dGhHWkF0bnJPRzYxdUlBWVpBcDQyQU16dE9mdXdpdEtRd1wifSIsInVpZCI6IkZhY2Vib29rOjg3NTAyODI1MjUzNDQ0MyIsInZlciI6IjIifQ.hyX4WZQkMQzryeai92oTk0NcrVv4T-XplOwGlkBkFq8"
      }
    })
    .then(function(response) {
      if(response.headers.get("content-type") === "application/json; charset=utf-8") {
        return response.json().then(function(json) {
          var test = json;
        });
      } else {
        console.log("Oops, we haven't got JSON!");
      }
    })
    .catch(error => 
     this.setState({
      isLoading: false,
      message: 'Something bad happened ' + error
   }));
  },


  insertGiraRequestWithPost()
  {
    fetch('https://giramobileservice.azure-mobile.net/tables/GiraRequest', {
      method: 'post',
      headers: {
        "Host": "giramobileservice.azure-mobile.net",
        "Content-Type": "application/json",
        "ACCEPT": "application/json",
        "X-ZUMO-APPLICATION": "eXVPAWPzwWRkMbTgjqmolczVUtfpyo18",
        "X-ZUMO-AUTH": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ1cm46bWljcm9zb2Z0OndpbmRvd3MtYXp1cmU6enVtbyIsImF1ZCI6InVybjptaWNyb3NvZnQ6d2luZG93cy1henVyZTp6dW1vIiwibmJmIjoxNDM4NzIyMzAzLCJleHAiOjE0NDEzMTQzMDMsInVybjptaWNyb3NvZnQ6Y3JlZGVudGlhbHMiOiJ7XCJhY2Nlc3NUb2tlblwiOlwiQ0FBR1RXVmZockl3QkFQOVJaQm5TOEFXYVpDNnpoVmdWQURVWFZhNzV1cXFTU2tPbnQ2dUlTYU9HNzlaQ0FRRjhUZTJ1NDhMQzVtZnVLeWlpT0ppMm5oTjhjWkJ0UUlFNnRmSmtqS1pDYzdOZHNORU5VVlVxZjVsSVpBdmJwenVQM2xpeW5IZjVOWDZGVXI5SVFzNlZJWFFnRnh3YlZGa2libXNEc3VaQTBxZXBZU1pBNDBJVVpBYWl0dGhHWkF0bnJPRzYxdUlBWVpBcDQyQU16dE9mdXdpdEtRd1wifSIsInVpZCI6IkZhY2Vib29rOjg3NTAyODI1MjUzNDQ0MyIsInZlciI6IjIifQ.hyX4WZQkMQzryeai92oTk0NcrVv4T-XplOwGlkBkFq8"
      },
      body: "{'location': 'insertGiraRequestWithPost1','date': '2015-08-05T20:30:00.000Z','startTime': '2015-08-05T20:30:00.000Z','stopTime': '2015-08-05T20:30:00.000Z','allDay': 'true','createdBy': 'facebook:123456','enabled': 'true','description': 'Description','giraTypeRefId': '2fa7186245c74643872830b832271564'}"
    })
    .then(function(response) {
      if(response.headers.get("content-type") === "application/json; charset=utf-8") {
        return response.json().then(function(json) {
          var test = json;
        });
      } else {
        console.log("Oops, we haven't got JSON!");
      }
    })
    .catch(error => 
     this.setState({
      isLoading: false,
      message: 'Something bad happened ' + error
   }));
  },

  _handleResponse(response) {
    this.setState({ isLoading: false , message: '' });
    if (response.application_response_code.substr(0, 1) === '1') {
      console.log('Properties found: ' + response.listings.length);
    } else {
      this.setState({ message: 'Location not recognized; please try again.'});
    }
  },

  readData()
  {
    AzureManager.readWithCompletion("GiraRequest", this.state.userid, this.state.azureToken,
        (error, dataReturned) => {
          if(error)
          {
            alert('Error: ' + error);
          }
          else
          {
            this.setState({data: dataReturned});
          }
      });
  },

  insertGiraRequest()
  {
    AzureManager.insertGiraRequest("Location", 
                                   "2015-07-30T19:03:26.57Z",
                                   "2015-07-30T19:03:26.57Z",
                                   "2015-07-30T19:03:26.57Z",
                                   "YES",
                                   "descritption1",
                                   "2fa7186245c74643872830b832271564",
                                   this.state.userid, 
                                   this.state.azureToken,
                                   (error, dataReturned) => {
          if(error)
          {
            alert('Error: ' + error);
          }
          else
          {
            this.setState({data: dataReturned});
          }
        });
  },

  render: function() {
    return (
      <ScrollView
              horizontal={false}
              vertical={true}
              contentInset={{top: 10}}
              style={[styles.scrollView, styles.horizontalScrollView]}>
        <TouchableHighlight onPress={this.login}>
          <Text style={styles.welcome}>
            Facebook Login
          </Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={this.readData}>
          <Text style={styles.welcome}>
            Read data
          </Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={this.getGiraRequests()}>
          <Text style={styles.welcome}>
            getGiraRequests
          </Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={this.insertGiraRequestWithPost}>
          <Text style={styles.welcome}>
            update data with post
          </Text>
        </TouchableHighlight>
        <Text style={styles.instructions}>
          {this.state.message}
        </Text>
        <WithLabel label="Value:">
          <Text>{
            this.state.date.toLocaleDateString() +
            ' ' +
            this.state.date.toLocaleTimeString()
          }</Text>
        </WithLabel>
        <WithLabel label="Timezone:">
          <TextInput
            onChange={this.onTimezoneChange}
            style={styles.textinput}
            value={this.state.timeZoneOffsetInHours.toString()} />
          <Text> hours from UTC</Text>
        </WithLabel>
        <Heading label="Date + time picker" />
        <DatePickerIOS
          date={this.state.date}
          mode="datetime"
          timeZoneOffsetInMinutes={this.state.timeZoneOffsetInHours * 60}
          onDateChange={this.onDateChange}  />
        <Heading label="Date picker" />
        <DatePickerIOS
          date={this.state.date}
          mode="date"
          timeZoneOffsetInMinutes={this.state.timeZoneOffsetInHours * 60}
          onDateChange={this.onDateChange} />
        <Heading label="Time picker, 10-minute interval" />
        <DatePickerIOS
          date={this.state.date}
          mode="time"
          timeZoneOffsetInMinutes={this.state.timeZoneOffsetInHours * 60}
          onDateChange={this.onDateChange}
          minuteInterval={10} />
      </ScrollView>
    );
  }
});

var styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#6A85B1',
    height: 300,
  },
  horizontalScrollView: {
    height: 120,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
    textinput: {
    height: 26,
    width: 50,
    borderWidth: 0.5,
    borderColor: '#0f0f0f',
    padding: 4,
    fontSize: 13,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  labelView: {
    marginRight: 10,
    paddingVertical: 2,
  },
  label: {
    fontWeight: '500',
  },
  headingContainer: {
    padding: 4,
    backgroundColor: '#f6f7f8',
  },
  heading: {
    fontWeight: '500',
    fontSize: 14,
  },
});

var WithLabel = React.createClass({
  render: function() {
    return (
      <View style={styles.labelContainer}>
        <View style={styles.labelView}>
          <Text style={styles.label}>
            {this.props.label}
          </Text>
        </View>
        {this.props.children}
      </View>
    );
  }
});

var Heading = React.createClass({
  render: function() {
    return (
      <View style={styles.headingContainer}>
        <Text style={styles.heading}>
          {this.props.label}
        </Text>
      </View>
    );
  }
});

AppRegistry.registerComponent('Gira_iOS', () => Gira_iOS);
*/