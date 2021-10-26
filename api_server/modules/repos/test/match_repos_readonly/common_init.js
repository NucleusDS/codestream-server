// base class for many tests of the "PUT /repos/match/:teamId" requests

'use strict';

const BoundAsync = require(process.env.CSSVC_BACKEND_ROOT + '/shared/server_utils/bound_async');
const CodeStreamAPITest = require(process.env.CSSVC_BACKEND_ROOT + '/api_server/lib/test_base/codestream_api_test');
const NormalizeURL = require(process.env.CSSVC_BACKEND_ROOT + '/api_server/modules/repos/normalize_url');
const ExtractCompanyIdentifier = require(process.env.CSSVC_BACKEND_ROOT + '/api_server/modules/repos/extract_company_identifier');

class CommonInit {

	init (callback) {
		BoundAsync.series(this, [
			this.setTestOptions,
			CodeStreamAPITest.prototype.before.bind(this),
			this.makeRequestData		// make the data to be used during the request
		], callback);
	}

	setTestOptions (callback) {
		this.teamOptions.creatorIndex = 1;
		//this.streamOptions.creatorIndex = 1;
		this.repoOptions.creatorIndex = 1;
		callback();
	}

	// form the data for the test request
	makeRequestData (callback) {
		this.requestData = this.getRequestData();
		this.path = `/repos/match/${this.team.id}?repos=` + encodeURIComponent(JSON.stringify(this.requestData));
		callback();
	}

	// get the data for the test request
	getRequestData () {
		return {
			repos: [{
				remotes: [this.repo.remotes[0].url]
			}]
		};
	}

	// perform the test request
	matchRepos (callback) {
		this.doApiRequest(
			{
				method: 'get',
				path: `/repos/match/${this.team.id}?repos=` + encodeURIComponent(JSON.stringify(this.data)),
				token: this.users[1].accessToken
			},
			(error, response) => {
				if (error) { return callback(error); }
				this.testResponse = response;
				callback();
			}
		);
	}

	getRemoteObject (url) {
		const normalizedUrl = NormalizeURL(url);
		const companyIdentifier = ExtractCompanyIdentifier.getCompanyIdentifier(normalizedUrl);
		return {
			url: normalizedUrl,
			normalizedUrl,
			companyIdentifier
		};
	}
}

module.exports = CommonInit;
