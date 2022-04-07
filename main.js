/* jshint -W097 */// jshint strict:false
/*jslint node: true */
'use strict';

// Get common adapter utils
var utils = require(__dirname + '/lib/utils'); 


var adapter = new utils.Adapter('berrycontrol');


adapter.on('ready', function () {
    main();
});

function main() {

    var deviceType = adapter.config.deviceType;
	var deviceStateList = '/home/pi/Programs/C/BerryControl/V3.0/deviceStateList.txt';
	
	// Log output
	adapter.log.info('Selected device type: ' + deviceType);

	// Window contact selected
	if (deviceType == "windowContact"){
		const lineReader = require('line-reader');
		
		lineReader.eachLine(deviceStateList,(line,last) => {
			adapter.log.debug('Read from textfile: ' + line);
			
			// Split read line to device type, address and value. Seperated by ','
			var splitReadLine = line.split(",");
			
			if (splitReadLine[0] == '3') {
				adapter.setObjectNotExists('windowContact' + splitReadLine[1] + '.Name', {
					type: 'string',
					common: {name: 'windowContact' + splitReadLine[1] + '.Name'},
					native: {}
				});
				adapter.setObjectNotExists('windowContact' + splitReadLine[1] + '.State', {
					type: 'string',
					common: {name: 'windowContact' + splitReadLine[1] + '.State'},
					native: {}
				});
				adapter.setObject('windowContact' + splitReadLine[1] + '.Battery', {
					type: 'string',
					common: {name: 'windowContact' + splitReadLine[1] + '.Battery'},
					native: {}
				});
				
				adapter.setState('windowContact' + splitReadLine[1]  + '.Name', splitReadLine[2]);
				
				if (splitReadLine[3] == '0') {
					adapter.log.debug('Window contact ' + splitReadLine[2] + 'with ID ' + splitReadLine[1] + ' is open and battery is ok');
					adapter.setState('windowContact' + splitReadLine[1]  + '.State', 'open');
					adapter.setState('windowContact' + splitReadLine[1]  + '.Battery', 'ok');
				}else if (splitReadLine[3] == '1') {
					adapter.log.debug('Window contact ' + splitReadLine[2] + 'with ID ' + splitReadLine[1] + ' is close and battery is ok');
					adapter.setState('windowContact' + splitReadLine[1]  + '.State', 'close');
					adapter.setState('windowContact' + splitReadLine[1]  + '.Battery', 'ok');
				}else if (splitReadLine[3] == '2') {
					adapter.log.warn('Battery of window contact ' + splitReadLine[2] + 'with ID ' + splitReadLine[1] + ' is empty!');
					adapter.setState('windowContact' + splitReadLine[1]  + '.Battery', 'empty');
				}else if (splitReadLine[3] == '3') {
					adapter.log.warn('Window contact ' + splitReadLine[2] + 'with ID ' + splitReadLine[1] + ' is open and battery is empty!');
					adapter.setState('windowContact' + splitReadLine[1]  + '.State', 'open');
					adapter.setState('windowContact' + splitReadLine[1]  + '.Battery', 'empty');
				}else if (splitReadLine[3] == '4') {
					adapter.log.warn('Window contact ' + splitReadLine[2] + 'with ID ' + splitReadLine[1] + ' is close and battery is empty!');
					adapter.setState('windowContact' + splitReadLine[1]  + '.State', 'close');
					adapter.setState('windowContact' + splitReadLine[1]  + '.Battery', 'empty');
				};
			};
		});
	// RF socket selected
	};
	// else if (deviceType == "socket"){
		// const lineReader1 = require('line-reader');
		// lineReader1.eachLine(deviceStateList,(line,last) => {
			// adapter.log.debug('Read from devicelist: ' + line);
			
			// // Split read line to device type, address and name. Seperated by ';'
			// var splitReadLine = line.split(";");
			
			// if (splitReadLine[0] == '1') {
				// adapter.setObject('socket' + splitReadLine[1] + '.Name', {
					// type: 'string',
					// common: {name: 'socket' + splitReadLine[1] + '.Name'},
					// native: {}
				// });
				// adapter.setObject('socket' + splitReadLine[1] + '.State', {
					// type: 'boolean',
					// common: {name: 'socket' + splitReadLine[1] + '.State'},
					// native: {}
				// });
				// adapter.setObject('socket' + splitReadLine[1] + '.setState', {
					// type: 'boolean',
					// common: {name: 'socket' + splitReadLine[1] + '.setState'},
					// native: {}
				// });
				
				// adapter.setState('windowContact' + splitReadLine[1]  + '.Name', splitReadLine[2]);
				
				// if (splitReadLine[3] == '0') {
					// adapter.log.debug('Socket ' + splitReadLine[2] + 'with ID ' + splitReadLine[1] + ' is switched off');
					// adapter.setState('socket' + splitReadLine[1]  + '.State', false);
				// }else if (splitReadLine[3] == '1') {
					// adapter.log.debug('Socket ' + splitReadLine[2] + 'with ID ' + splitReadLine[1] + ' is switched on');
					// adapter.setState('socket' + splitReadLine[1]  + '.State', true);
					
				// // Check if current state = setState. If not, set new state
				// };
			// };
		// });
	// };
}
