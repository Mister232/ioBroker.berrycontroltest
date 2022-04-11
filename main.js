/* jshint -W097 */// jshint strict:false
/*jslint node: true */
'use strict';

// Get common adapter utils
var utils = require(__dirname + '/lib/utils'); 


var adapter = new utils.Adapter('berrycontrol');


adapter.on('ready', function () {
    main();
});


adapter.on('stateChange', function (objectName, state) {
	const fs = require('fs');
	
	let objectNameSplitted = objectName.split(".");
	var deviceID = objectNameSplitted[2];
	
	adapter.log.info('New state for ' + objectName + ' is ' + state.val);
	
	if (objectName.indexOf("socket")) {
		adapter.log.info('Test');
		if (state.val == 'on') {
			fs.writeFileSync('/home/pi/Programs/C/BerryControl/V3.0/actuatorCMD1.txt', '1,' + deviceID.substring(6) + ',1');
		} else if (state.val == 'off') {
			fs.writeFileSync('/home/pi/Programs/C/BerryControl/V3.0/actuatorCMD1.txt', '1,' + deviceID.substring(6) + ',0');
		};
		
		fs.writeFileSync('/home/pi/Programs/C/BerryControl/V3.0/cmdAval1.txt', '1');
	};
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
			
			// Split read line to device type, address and value. Seperated by ','
			var splitReadLine = line.split(";");
			
			if (splitReadLine[0] == '3') {
				adapter.log.info('Read from textfile: ' + line);
				
				adapter.setObjectNotExists('windowContact' + splitReadLine[1] + '.Name', {
					type: 'state',
					common: {name: 'windowContact' + splitReadLine[1] + '.Name', type: 'string'},
					native: {}
				});
				adapter.setObjectNotExists('windowContact' + splitReadLine[1] + '.ID', {
					type: 'state',
					common: {name: 'windowContact' + splitReadLine[1] + '.ID', type: 'string'},
					native: {}
				});
				adapter.setObjectNotExists('windowContact' + splitReadLine[1] + '.State', {
					type: 'state',
					common: {name: 'windowContact' + splitReadLine[1] + '.State', type: 'string'},
					native: {}
				});
				adapter.setObjectNotExists('windowContact' + splitReadLine[1] + '.Battery', {
					type: 'state',
					common: {name: 'windowContact' + splitReadLine[1] + '.Battery', type: 'string'},
					native: {}
				});
				
				adapter.subscribeStates('*');
				
				adapter.setState('windowContact' + splitReadLine[1]  + '.Name', splitReadLine[2]);
				adapter.setState('windowContact' + splitReadLine[1]  + '.ID', splitReadLine[1]);
				
				if (splitReadLine[3] == '0') {
					adapter.log.info('Window contact ' + splitReadLine[2] + ' with ID ' + splitReadLine[1] + ' is open and battery is ok');
					adapter.setState('windowContact' + splitReadLine[1]  + '.State', 'open');
					adapter.setState('windowContact' + splitReadLine[1]  + '.Battery', 'ok');
				}else if (splitReadLine[3] == '1') {
					adapter.log.info('Window contact ' + splitReadLine[2] + ' with ID ' + splitReadLine[1] + ' is close and battery is ok');
					adapter.setState('windowContact' + splitReadLine[1]  + '.State', 'close');
					adapter.setState('windowContact' + splitReadLine[1]  + '.Battery', 'ok');
				}else if (splitReadLine[3] == '2') {
					adapter.log.info('Battery of window contact ' + splitReadLine[2] + 'with ID ' + splitReadLine[1] + ' is empty!');
					adapter.setState('windowContact' + splitReadLine[1]  + '.Battery', 'empty');
				}else if (splitReadLine[3] == '3') {
					adapter.log.info('Window contact ' + splitReadLine[2] + ' with ID ' + splitReadLine[1] + ' is open and battery is empty!');
					adapter.setState('windowContact' + splitReadLine[1]  + '.State', 'open');
					adapter.setState('windowContact' + splitReadLine[1]  + '.Battery', 'empty');
				}else if (splitReadLine[3] == '4') {
					adapter.log.info('Window contact ' + splitReadLine[2] + ' with ID ' + splitReadLine[1] + ' is close and battery is empty!');
					adapter.setState('windowContact' + splitReadLine[1]  + '.State', 'close');
					adapter.setState('windowContact' + splitReadLine[1]  + '.Battery', 'empty');
				};
			};
		});
	// RF socket selected
	} else if (deviceType == "socket"){
		const lineReader1 = require('line-reader');
		lineReader1.eachLine(deviceStateList,(line,last) => {
			
			// Split read line to device type, address and name. Seperated by ';'
			var splitReadLine1 = line.split(";");
			
			if (splitReadLine1[0] == '1') {
				adapter.log.info('Read from devicelist: ' + line);
				
				adapter.setObjectNotExists('socket' + splitReadLine1[1] + '.Name', {
					type: 'state',
					common: {name: 'socket' + splitReadLine1[1] + '.Name', type: 'string'},
					native: {}
				});
				adapter.setObjectNotExists('socket' + splitReadLine1[1] + '.ID', {
					type: 'state',
					common: {name: 'socket' + splitReadLine1[1] + '.ID', type: 'string'},
					native: {}
				});
				adapter.setObjectNotExists('socket' + splitReadLine1[1] + '.State', {
					type: 'state',
					common: {name: 'socket' + splitReadLine1[1] + '.State', type: 'string'},
					native: {}
				});
				adapter.setObjectNotExists('socket' + splitReadLine1[1] + '.setState', {
					type: 'state',
					common: {name: 'socket' + splitReadLine1[1] + '.setState', type: 'string'},
					native: {}
				});
				
				adapter.subscribeStates('*');
				
				adapter.setState('socket' + splitReadLine1[1]  + '.Name', splitReadLine1[2]);
				adapter.setState('socket' + splitReadLine1[1]  + '.ID', splitReadLine1[1]);
				
				if (splitReadLine1[3] == '0') {
					adapter.log.info('Socket ' + splitReadLine1[2] + ' with ID ' + splitReadLine1[1] + ' is switched off');
					adapter.setState('socket' + splitReadLine1[1]  + '.State', 'off');
				}else if (splitReadLine1[3] == '1') {
					adapter.log.info('Socket ' + splitReadLine1[2] + ' with ID ' + splitReadLine1[1] + ' is switched on');
					adapter.setState('socket' + splitReadLine1[1]  + '.State', 'on');
				};
				
				
				// adapter.getState('socket' + splitReadLine1[1]  + '.State', (err,state) =>
				// {
					// adapter.getState('socket' + splitReadLine1[1]  + '.setState', (err,setState) =>
					// {
						// //Check if current state = setState. If not, set new state
						// if (state.val != setState.val) {
							// const fs = require('fs');
							
							// if (setState.val == 'on') {
								// adapter.log.info('New state for socket' + splitReadLine1[1] + ' on');
								// fs.writeFileSync('/home/pi/Programs/C/BerryControl/V3.0/actuatorCMD1.txt', '1,' + splitReadLine1[1] + ',1');
							// } else if (setState.val == 'off') {
								// adapter.log.info('New state for socket' + splitReadLine1[1] + ' off');
								// fs.writeFileSync('/home/pi/Programs/C/BerryControl/V3.0/actuatorCMD1.txt', '1,' + splitReadLine1[1] + ',0');
							// };
							
							// fs.writeFileSync('/home/pi/Programs/C/BerryControl/V3.0/cmdAval1.txt', '1');
						// };
					// });
				// });
			};
		});
	};
}
