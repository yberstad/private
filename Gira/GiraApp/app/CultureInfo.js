const localKey = 'localKey';

var AsyncStorage = require('react-native').AsyncStorage;
var Culture = require('NativeModules').CultureInfo;

class CultureInfo {
	getLocal(callback)
	{
		AsyncStorage.getItem(localKey, (err, val) => {
			if(err){
				return callback(err);
			}

			if(!val)
			{
				Culture.getCultureInfo((locale) => {
					AsyncStorage.setItem(localKey, locale);
				});	
				val = locale;
			}
			return callback(null, val);
		});
	}
}

module.exports = new CultureInfo;