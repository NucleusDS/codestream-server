#!/usr/bin/env node
'use strict';

var PubNub_Config = require(process.env.CS_API_TOP + '/config/pubnub.js');
var PubNub_Client = require('pubnub');

var pubnub = new PubNub_Client(PubNub_Config);

var channels;
if (process.argv[2]) {
	channels = process.argv[2].split(',');
}
else {
	console.error('No channels');
	process.exit();

}
pubnub.addListener({
	message: (message) => {
		let stringified = JSON.stringify(message.message, undefined, 5);
		console.log(`\nMESSAGE ON ${message.channel}:\n${stringified}`);
	}
});

pubnub.subscribe({ channels: channels });
