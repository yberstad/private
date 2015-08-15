var AsyncStorage = require('react-native').AsyncStorage;

/*const host = '192.168.1.64'
const app_key = 'Overridden by portal settings';*/
const host = 'giramobileservice.azure-mobile.net'
const app_key = 'eXVPAWPzwWRkMbTgjqmolczVUtfpyo18';
const tokenKey = 'tokenKey';
const userIdKey = 'userIdKey';

var AzureManager = require('NativeModules').AzureMSClient;

class AzureApi {
	getAuthInfo(callback)
	{
		AsyncStorage.getItem(tokenKey, (err, val) => {
			if(err){
				return callback(err);
			}

			if(!val)
			{
				return callback();
			}
			var authInfo = {
				headers: {
					'Host': host,
					'Content-Type': 'application/json',
					'ACCEPT': 'application/json',
					'X-ZUMO-APPLICATION': app_key,
					'X-ZUMO-AUTH': val
	    		}
			}
			return callback(null, authInfo);
		});
	}

	login(provider, callback){
	 	AzureManager.loginWithProvider(provider,  (err, info) => {
	 		AsyncStorage.multiSet([
	 			[tokenKey, info.token], 
	 			[userIdKey, info.userId]]);
	    	callback(err, info)
	  	});
	}

	getGiraRequestList(authInfo, callback)
	{
		var url = 'http://' + host + '/tables/GiraRequest';
	  	fetch(url, {
	    	method: 'get',
	    	headers: authInfo.headers
		})
		.then(response => response.json())
		.then(json => callback(null, json))
		.catch(error => {
	    	callback(error, null);
		});
	}
}

module.exports = new AzureApi();
