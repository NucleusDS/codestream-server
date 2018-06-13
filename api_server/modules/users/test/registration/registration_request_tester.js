// handle unit tests for the "POST /no-auth/register" request to register a user
'use strict';

const RegistrationTest = require('./registration_test');
const NoAttributeTest = require('./no_attribute_test');
const UserExistsTest = require('./user_exists_test');
const RegisteredUserExistsTest = require('./registered_user_exists_test');
const BadEmailTest = require('./bad_email_test');
const BadUsernameTest = require('./bad_username_test');
const BadPasswordTest = require('./bad_password_test');
const ConflictingUsernameTest = require('./conflicting_username_test');
const UserMessageToTeamTest = require('./user_message_to_team_test');
const UserMessageToOtherUserTest = require('./user_message_to_other_user_test');
const ConfirmationEmailTest = require('./confirmation_email_test');
const ConfirmationEmailWithLinkTest = require('./confirmation_email_with_link_test');
const AlreadyRegisteredEmailTest = require('./already_registered_email_test');
const PreferencesTest = require('./preferences_test');
const SerializeTests = require(process.env.CS_API_TOP + '/lib/test_base/serialize_tests');

class RegistrationRequestTester {

	registrationTest () {
		new RegistrationTest().test();
		new NoAttributeTest({ attribute: 'email' }).test();
		new NoAttributeTest({ attribute: 'password' }).test();
		new NoAttributeTest({ attribute: 'username' }).test();
		new BadEmailTest().test();
		new BadUsernameTest().test();
		new BadPasswordTest().test();
		new UserExistsTest().test();
		new RegisteredUserExistsTest().test();
		new ConflictingUsernameTest().test();
		new UserMessageToTeamTest().test();
		new UserMessageToOtherUserTest().test();
		// these tests must be serialized because for technical reasons the tests
		// are actually run in their "before" stage, and they will fail due to timeouts
		// if they are run in parallel
		SerializeTests([
			ConfirmationEmailTest,
			ConfirmationEmailWithLinkTest,
			AlreadyRegisteredEmailTest
		]);
		new PreferencesTest().test();
	}
}

module.exports = RegistrationRequestTester;
