// provides a slack integration service to the API server, this allows posts to be
// sent to and received from our slack bot

'use strict';

const APIServerModule = require(process.env.CS_API_TOP + '/lib/api_server/api_server_module');
const SlackBotClient = require('./slack_bot_client');
const HttpProxy = require('express-http-proxy');

const SLACK_INTEGRATION_ROUTES = [
	{
		method: 'put',
		path: 'no-auth/slack-enable',
		requestClass: require('./slack_enable_request')
	},
	{
		method: 'post',
		path: 'no-auth/slack-post',
		requestClass: require('./slack_post_request')
	}
];

class Messager extends APIServerModule {

	services () {
		// return a function that, when invoked, returns a service structure with the pubnub client as
		// the messager service
		return (callback) => {
			if (!this.api.config.slack || !this.api.config.slack.slackBotOrigin) {
				this.api.warn('Will not connect to Slack, no Slack configuration or origin supplied');
				return process.nextTick(callback);
			}

			this.api.log('Connecting to Slack bot...');
			this.slackBotClient = new SlackBotClient(this.api.config.slack);
			return callback(null, [{ slack: this.slackBotClient }]);
		};
	}

	getRoutes () {
		// provide a route for incoming posts from the slack-bot
		return SLACK_INTEGRATION_ROUTES;
	}

	// initialize the module
	initialize (callback) {
		// proxying these requests to the slackbot for authorization flow
		// and message reception
		const slackOriginUrl = this.api.config.slack.slackBotOrigin;
		this.api.express.use('/no-auth/slack/addtoslack', HttpProxy(`${slackOriginUrl}/addtoslack`));
		this.api.express.use('/no-auth/slack/oauth', HttpProxy(`${slackOriginUrl}/oauth`));
		this.api.express.use('/no-auth/slack/receive', HttpProxy(`${slackOriginUrl}/slack/receive`));
		callback();
	}


}

module.exports = Messager;
