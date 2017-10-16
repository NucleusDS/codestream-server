'use strict';

var Assert = require('assert');
var CodeStream_API_Test = require(process.env.CS_API_TOP + '/lib/test_base/codestream_api_test');

class Get_My_Companies_Test extends CodeStream_API_Test {

	get description () {
		return 'should return my companies when requesting my companies';
	}

	get path () {
		return '/companies/~';
	}

	validate_response (data) {
		let companies = data.companies;
		Assert(companies.length === 1, 'one company should be returned');
		return this.validate_matching_object(this.current_companies[0]._id, companies[0], 'company');
	}
}

module.exports = Get_My_Companies_Test;
