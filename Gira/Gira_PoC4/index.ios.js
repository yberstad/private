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
  TouchableHighlight,
  PixelRatio,
  Image,
  Dimensions
} from 'react-native';

// Parse
var Parse = require('parse/react-native');
var ParseReact = require('parse-react/react-native');
var ParseComponent = ParseReact.Component(React);

// Facebook integration
var FBSDKCore = require('react-native-fbsdkcore');
var FBSDKLogin = require('react-native-fbsdklogin');
var {
  FBSDKLoginButton,
} = FBSDKLogin;
var {
  FBSDKAccessToken,
  FBSDKGraphRequest
} = FBSDKCore;

// Image picker
var UIImagePickerManager = require('NativeModules').UIImagePickerManager;
var options = {
  title: 'Select Avatar', // specify null or empty string to remove the title
  cancelButtonTitle: 'Cancel',
  takePhotoButtonTitle: 'Take Photo...', // specify null or empty string to remove this button
  chooseFromLibraryButtonTitle: 'Choose from Library...', // specify null or empty string to remove this button
  cameraType: 'back', // 'front' or 'back'
  mediaType: 'photo', // 'photo' or 'video'
  videoQuality: 'high', // 'low', 'medium', or 'high'
  maxWidth: 100, // photos only
  maxHeight: 100, // photos only
  quality: 0.2, // photos only
  allowsEditing: false, // Built in iOS functionality to resize/reposition the image
  noData: false, // photos only - disables the base64 `data` field from being generated (greatly improves performance on large photos)
  storageOptions: { // if this key is provided, the image will get saved in the documents directory (rather than a temporary directory)
    skipBackup: true, // image will NOT be backed up to icloud
    //path: 'images' // will save image at /Documents/images rather than the root
  }
};

// MapView
var MapView = require('react-native-maps');

var { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = 62.47222;
const LONGITUDE = 6.14948;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;


class Gira_PoC4 extends ParseComponent {

  constructor(props) {
    super(props);
    this.state = {loadingCurrentUser: false, user: null, message: null, avatarSource: null,      
      region: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      zoomEnabled: true,
      initialPosition: 'unknown',
      lastPosition: 'unknown'
    };
  }

  componentDidMount() {
    /*navigator.geolocation.getCurrentPosition(
      (position) => {
        var initialPosition = JSON.stringify(position);
        this.setState({initialPosition});
      },
      (error) => alert(error.message),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
    this.watchID = navigator.geolocation.watchPosition((position) => {
      var lastPosition = JSON.stringify(position);
      this.setState({lastPosition});
    });*/
  }

  componentWillUnmount() {
    //navigator.geolocation.clearWatch(this.watchID);
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

  savePosition() {
    var _this = this;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        var initialPosition = JSON.stringify(position);
        this.setState({initialPosition});
        var point = new Parse.GeoPoint({latitude: position.coords.latitude, longitude: position.coords.longitude});
        ParseReact.Mutation.Set(_this.data.listings[0], {
          geoPoint: point
        }).dispatch();
      });
  }

  openImageSelector(){
    UIImagePickerManager.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      }
      else if (response.error) {
        console.log('UIImagePickerManager Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        // You can display the image using either data:
        const source = {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true};

        // uri (on iOS)
        //const source = {uri: response.uri.replace('file://', ''), isStatic: true};

        this.setState({
          avatarSource: source
        });
      }
    });
  }

  uploadImage(){
    this.addImageToGiraRequest(this.state.avatarSource.uri, this.data.listings[0], (err, file) => {
      if(err)
      {
        console.log(err);
      }
      else
      {
        console.log(file);
      }
    });
  }

  addImageToGiraRequest(base64, giraRequests, callback){
    var name = "photo.jpg"
    var parseFile = new Parse.File(name, {base64: base64.substring(23)})
    parseFile.save().then(function(){
        ParseReact.Mutation.Create('GiraFiles', {
          fileInfo: parseFile,
          pointerToGiraRequest: giraRequests
        }).dispatch();
        if(callback){
            callback(null, parseFile)
        }
    }).fail(function(e){
        if(callback){
            callback(e,null)
        }
    })
  }

  getFiles()
  {
    var query = new Parse.Query("GiraFiles");
    query.equalTo("pointerToGiraRequest", this.data.listings[0]);
    query.find({
      success: function(results) {
        alert("Successfully retrieved " + results.length + " scores.");
        // Do something with the returned Parse.Object values
        for (var i = 0; i < results.length; i++) {
          var object = results[i];
          alert(object.id + ' - ' + object.get('fileInfo')._url);
        }
      },
      error: function(error) {
        alert("Error: " + error.code + " " + error.message);
      }
    });
  }

  onMapPress(coordinate)
  {
    console.log(coordinate);
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
      <MapView
                ref="map"
                style={styles.map}
                region={this.state.region}
                onRegionChange={this.onRegionChange}
                zoomEnabled = {this.state.zoomEnabled}
                onPress={this.onMapPress}
              >
      </MapView>
      <Text>
        <Text style={styles.title}>Initial position: </Text>
        {this.state.initialPosition}
      </Text>
      <Text>
        <Text style={styles.title}>Current position: </Text>
        {this.state.lastPosition}
      </Text>
      <TouchableHighlight onPress={()=> { this.setState({isLoading:true});}}>
        <Text>Hent data</Text>
      </TouchableHighlight>
      <TouchableHighlight onPress={()=> { this.createGiraRequest(); }}>
        <Text>Lagre data</Text>
      </TouchableHighlight>
      <TouchableHighlight onPress={()=> { this.openImageSelector(); }}>
        <Text>Ta bilde</Text>
      </TouchableHighlight>
      <TouchableHighlight onPress={()=> { this.getFiles(); }}>
        <Text>Hent bilder</Text>
      </TouchableHighlight>
            <TouchableHighlight onPress={()=> { this.savePosition(); }}>
        <Text>Lagre gjeldende posisjon</Text>
      </TouchableHighlight>
      <View style={[styles.avatar, styles.avatarContainer, {marginBottom: 20}]}>
        { this.state.avatarSource === null ? <Text>Select a Photo</Text> :
          <Image style={styles.avatar} source={this.state.avatarSource} />
        }
      </View>
      <TouchableHighlight onPress={ () => this.uploadImage()}>
        <Text>Last opp bilde</Text>
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
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
  avatarContainer: {
    borderColor: '#9B9B9B',
    borderWidth: 1 / PixelRatio.get(),
    justifyContent: 'center',
    alignItems: 'center'
  },
  avatar: {
    borderRadius: 75,
    width: 150,
    height: 150
  },
  title: {
    fontWeight: '500',
  },
});

AppRegistry.registerComponent('main', () => Gira_PoC4);
