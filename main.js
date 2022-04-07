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
	var splitReadLine;
	
	// Log output
	adapter.log.info('Selected device type: ' + deviceType);

	// Window contact selected
	if (deviceType == "windowContact"){
		const lineReader = require('line-reader');
		lineReader.eachLine('/home/pi/Programs/C/BerryControl/V3.0/sensorVals.txt',(line,last)=>{
			adapter.log.info('Read from textfile: ' + line);
			// Split read line to device type, address and value. Seperated by ','
			splitReadLine = line.split(",");;
		})
		
		if (splitReadLine[0] == '3') {
			adapter.setObject('windowContact' + splitReadLine[1] + '.State', {
				type: 'text',
				common: {
					name: 'windowContact' + splitReadLine[1] + '.State',
					type: 'text',
					role: 'state'
				},
				native: {}
			});
			adapter.setObject('windowContact' + splitReadLine[1] + '.Battery', {
				type: 'text',
				common: {
					name: 'windowContact' + splitReadLine[1] + '.Battery',
					type: 'text',
					role: 'state'
				},
				native: {}
			});
		};
		
		if (splitReadLine[2] == '0') {
			adapter.setState('windowContact' + splitReadLine[1]  + '.State', 'open');
			adapter.setState('windowContact' + splitReadLine[1]  + '.Battery', 'ok');
		}else if (splitReadLine[2] == '1') {
			adapter.setState('windowContact' + splitReadLine[1]  + '.State', 'close');
			adapter.setState('windowContact' + splitReadLine[1]  + '.Battery', 'ok');
		}else if (splitReadLine[2] == '2') {
			adapter.setState('windowContact' + splitReadLine[1]  + '.Battery', 'empty');
		}else if (splitReadLine[2] == '3') {
			adapter.setState('windowContact' + splitReadLine[1]  + '.State', 'open');
			adapter.setState('windowContact' + splitReadLine[1]  + '.Battery', 'empty');
		}else if (splitReadLine[2] == '4') {
			adapter.setState('windowContact' + splitReadLine[1]  + '.State', 'close');
			adapter.setState('windowContact' + splitReadLine[1]  + '.Battery', 'empty');
		};
	};

    // in this template all states changes inside the adapters namespace are subscribed
    adapter.subscribeStates('*');
}
