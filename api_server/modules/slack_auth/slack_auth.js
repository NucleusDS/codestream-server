// provide service to handle slack credential authorization

'use strict';

const OAuthModule = require(process.env.CS_API_TOP +
	'/lib/oauth/oauth_module.js');
const SlackAuthorizer = require('./slack_authorizer');

const OAUTH_CONFIG = {
	provider: 'slack',
	host: 'slack.com',
	apiHost: 'slack.com/api',
	authPath: 'oauth/authorize',
	tokenPath: 'api/oauth.access',
	exchangeFormat: 'form',
	scopes: 'identify client',
	hasSharing: true
};

const STRICT_SCOPES = [
	'channels:history',
	'channels:read',
	'channels:write',
	'chat:write:user',
	'groups:history',
	'groups:read',
	'groups:write',
	'im:history',
	'im:read',
	'im:write',
	'users:read',
	'users:read.email',
	'users.profile:read',
	'reactions:write',
	'mpim:history',
	'mpim:read',
	'mpim:write'
];

const SHARING_SCOPES = [
	'channels:read',
	'chat:write:user',
	'groups:read',
	'im:read',
	'users:read',
	'users:read.email',
	'mpim:read'
];

class SlackAuth extends OAuthModule {
	constructor(config) {
		super(config);
		this.oauthConfig = OAUTH_CONFIG;
	}

	async authorizeProviderInfo(providerInfo, options) {
		return await new SlackAuthorizer({
			providerInfo,
			options
		}).exchangeAndAuthorize();
	}

	// overrides OAuthModule.getRedirectData to allow for "slack-lite", slack without the
	// scary "client" scope
	getRedirectData(options) {
		const data = super.getRedirectData(options);
		if (options.access === 'strict') {
			data.parameters.scope = STRICT_SCOPES.join(' ');
		} else if (options.sharing) {
			data.parameters.scope = SHARING_SCOPES.join(' ');
		}
		return data;
	}

	// overrides OAuthModule.getClientInfo to allow for "slack-lite", slack without the
	// scary "client" scope ... in this case, we use different client ID and secret
	getClientInfo(options) {
		const info = super.getClientInfo(options);
		if (options.access === 'strict') {
			info.clientId = this.apiConfig.appStrictClientId;
			info.clientSecret = this.apiConfig.appStrictClientSecret;
		} else if (options.sharing) {
			info.clientId = this.apiConfig.appSharingClientId;
			info.clientSecret = this.apiConfig.appSharingClientSecret;
		}
		return info;
	}

	validateChannelName(name) {
		if (name.match(/[^a-z0-9-_[\]{}\\/]/)) {
			return 'illegal characters in channel name';
		}
		if (name.length > 21) {
			return 'name must be no longer than 21 characters';
		}
	}

	// match the given slack identity to a CodeStream identity
	async getUserIdentity(options) {
		const authorizer = new SlackAuthorizer({ options });
		return await authorizer.getSlackIdentity(
			options.accessToken,
			options.providerInfo
		);
	}

	// an access token can be maintained for each slack workspace
	getMultiAuthKey (info) {
		return info && info.data && info.data.team_id;
	}
}

module.exports = SlackAuth;
