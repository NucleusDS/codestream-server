// handle unit tests for the "GET /markers" request

'use strict';

const GetMarkersTest = require('./get_markers_test');
const GetMarkersByIdTest = require('./get_markers_by_id_test');
const MarkerLocationsTest = require('./marker_locations_test');
const NoParameterTest = require('./no_parameter_test');
const StreamNotFoundTest = require('./stream_not_found_test');
const ACLStreamTest = require('./acl_stream_test');
const ACLTeamTest = require('./acl_team_test');
const StreamNoMatchTeamTest = require('./stream_no_match_team_test');
const TooManyIDsTest = require('./too_many_ids_test');
const GetPostlessMarkersTest = require('./get_postless_markers_test');
const GetPostlessMarkersWithItemsTest = require('./get_postless_markers_with_items_test');

class GetMarkersRequestTester {

	getMarkersTest () {
		new GetMarkersTest().test();
		new GetMarkersByIdTest().test();
		new MarkerLocationsTest().test();
		new NoParameterTest({ parameter: 'teamId' }).test();
		new NoParameterTest({ parameter: 'streamId' }).test();
		new StreamNotFoundTest().test();
		new ACLStreamTest().test();
		new ACLTeamTest().test();
		new StreamNoMatchTeamTest().test();
		new TooManyIDsTest().test();
		new GetPostlessMarkersTest().test();
		new GetPostlessMarkersWithItemsTest().test();
	}
}

module.exports = GetMarkersRequestTester;
