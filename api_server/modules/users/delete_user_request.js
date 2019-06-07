// handle the DELETE /users/:id request to delete (deactivate) a user

'use strict';

const DeleteRequest = require(process.env.CS_API_TOP + '/lib/util/restful/delete_request');
const SecretsConfig = require(process.env.CS_API_TOP + '/config/secrets');

class DeleteUserRequest extends DeleteRequest {

	// authorize the request for the current user
	async authorize () {
		// currently can only be done if a secret is provided
		if (this.request.headers['x-delete-user-secret'] !== SecretsConfig.confirmationCheat) {
			throw this.errorHandler.error('deleteAuth');
		}
	}

	// TODO - flesh this out for user publishing, remove user from teams, and describe
}

module.exports = DeleteUserRequest;
