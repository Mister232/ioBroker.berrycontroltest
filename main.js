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
	var deviceID = adapter.config.deviceID;
	var readLine;
	
	// Log output
	adapter.log.info('Device type: ' + deviceType);
    adapter.log.info('Device ID: ' + deviceID);

	// Window contact selected
	if (deviceType == "windowContact"){
		var ID = "3";
		
		const lineReader = require('line-reader');
		lineReader.eachLine('/home/pi/Programs/C/BerryControl/V3.0/sensorVals.txt',(line,last)=>{
			adapter.log.info('Read from textfile: ' + line);
			readLine = line;
		})

		adapter.setObject('windowContact' + deviceID, {
			type: 'state',
			common: {
				name: 'windowContact' + deviceID,
				type: 'boolean',
				role: 'indicator'
			},
			native: {}
		});
		
		adapter.setState('windowContact' + deviceID, true);
	};

    // in this template all states changes inside the adapters namespace are subscribed
    adapter.subscribeStates('*');


    // the variable testVariable is set to true as command (ack=false)
    //adapter.setState('testVariable', true);

    // same thing, but the value is flagged "ack"
    // ack should be always set to true if the value is received from or acknowledged from the target system
    //adapter.setState('testVariable', {val: true, ack: true});

    // same thing, but the state is deleted after 30s (getState will return null afterwards)
    //adapter.setState('testVariable', {val: true, ack: true, expire: 30});



    // examples for the checkPassword/checkGroup functions
    adapter.checkPassword('admin', 'iobroker', function (res) {
        console.log('check user admin pw ioboker: ' + res);
    });

    adapter.checkGroup('admin', 'admin', function (res) {
        console.log('check group user admin group admin: ' + res);
    });



}
