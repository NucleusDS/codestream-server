'use strict';

var MessageToTeamTest = require('./message_to_team_test');

class MessageToStreamTest extends MessageToTeamTest {

	get description () {
		return `members of the stream should receive a message with the deactivated post when a post is deleted, for ${this.streamType} streams`;
	}

	// set the name of the channel we expect to receive a message on
	setChannelName (callback) {
		// it is the stream channel
		this.channelName = 'stream-' + this.stream._id;
		callback();
	}
}

module.exports = MessageToStreamTest;
