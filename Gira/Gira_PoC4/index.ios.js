/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';
import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View,
  TouchableHighlight
} from 'react-native';

var Parse = require('parse/react-native');
var ParseReact = require('parse-react/react-native');
var ParseComponent = ParseReact.Component(React);


var FBSDKCore = require('react-native-fbsdkcore');
var FBSDKLogin = require('react-native-fbsdklogin');

var {
  FBSDKLoginButton,
} = FBSDKLogin;

var {
  FBSDKAccessToken,
  FBSDKGraphRequest
} = FBSDKCore;


class Gira_PoC4 extends ParseComponent {

  getInitialState() {
    return {loadingCurrentUser: false, user: null, message: null};
  }
  
  componentWillMount() {
    Parse.initialize(
      'licwwCwfGAMGMTy7ufvDVoQl3QzcMMBFay0cU6Ln', 
      '9ysnyGXuFhV5NT933LljkoPFV8BYawvxpUiSzeeg');
  }

  observe(props, state) {
    var listingQuery = (new Parse.Query('GiraRequest')).ascending('createdAt');
    var giraTypeListQuery = (new Parse.Query('GiraType')).ascending('createdAt');
    return { listings: listingQuery, giraTypeList: giraTypeListQuery, user: ParseReact.currentUser };
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.queryErrors() !== null) {
      this.setState({ message: 'There was a problem fetching the results' });
      console.log(this.queryErrors());
    }
  }

  createGiraRequest() {
    ParseReact.Mutation.Create('GiraRequest', {
      location: 'Bohuslän      ',
      description: 'Kileklatring'
    }).dispatch();
  }

  handleLogin(token) {
    if (!token) {
      return;
    }
    var authData = {
      id: token.userID,
      access_token: token.tokenString,
      expiration_date: new Date(token._expirationDate).toISOString()
    };

    Parse.FacebookUtils.logIn(authData, {
      success: (user) => {
        if (user.existed()) {
          // login: nothing to do
        } else {
          // Create a graph request asking for friends with a callback to handle the response.
          var fetchFriendsRequest = new FBSDKGraphRequest((error, result) => {
            if (error) {
              alert('Error making request. ');
            } else {
              // Data from request is in result
              var userId =    { 
                className: '_User',
                objectId: user.id
              }
              ParseReact.Mutation.Set(userId, {
                username: result.email,
                email: result.email,
                name: result.name
              }).dispatch({waitForServer:true});
              this.setState({loadingCurrentUser: true});
            }
          }, '/me?fields=name,email');
          // Start the graph request.
          fetchFriendsRequest.start();
        }
      },
      error: (user, error) => {
          console.log(error);
          switch (error.code) {
             case Parse.Error.INVALID_SESSION_TOKEN:
                alert('Invalid session.');
                 Parse.User.logOut().then(() => {
                     alert('Invalid session -> Logged out. ');
                     //this.handleLogin(token);
                 });
                 break;
             default:
                 this.setState({loadingCurrentUser: false});
                 alert(error.message);
          }
       }    
     });
  }

  render() {
    console.log(this.data);
    var _this = this;
    return (
      <View style={styles.container}>
      <TouchableHighlight onPress={()=> { this.setState({isLoading:true});}}>
        <Text>Hent data</Text>
      </TouchableHighlight>
      <TouchableHighlight onPress={()=> { this.createGiraRequest(); }}>
        <Text>Lagre data</Text>
      </TouchableHighlight>
        <FBSDKLoginButton
                  onWillLogin ={() => { 
                    Parse.User.logOut().then(() => {
                      alert('Logged out. ');
                    });
                    this.setState({loadingCurrentUser: true});
                  }}
                  onLoginFinished={(error, result) => {
                    if (error) {
                      alert('Error logging in.');
                    } else {
                      if (result.isCancelled) {
                        alert('Login cancelled.');
                      } else {
                        FBSDKAccessToken.getCurrentAccessToken(
                                          (token) => this.handleLogin(token)
                                        );
                        alert('Logged in.');
                      }
                    }
                  }}
                  onLogoutFinished={() => { 
                    Parse.User.logOut().then(() => {
                      alert('Logged out.');
                    });
                    
                  }}
                  readPermissions={[]}
                  publishPermissions={['publish_actions']}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
});

AppRegistry.registerComponent('Gira_PoC4', () => Gira_PoC4);
