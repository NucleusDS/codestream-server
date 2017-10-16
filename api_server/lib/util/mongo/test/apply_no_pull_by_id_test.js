'use strict';

var Bound_Async = require(process.env.CS_API_TOP + '/lib/util/bound_async');
var Get_By_Id_Test = require('./get_by_id_test');

class Apply_No_Pull_By_Id_Test extends Get_By_Id_Test {

	get description () {
		return 'should get an unchanged document after applying a no-op pull operation to a document';
	}

	before (callback) {
		Bound_Async.series(this, [
			super.before,
			this.update_document
		], callback);
	}

	update_document (callback) {
		const update = {
			array: 8
		};
		this.data.test.apply_op_by_id(
			this.test_document._id,
			{ pull: update },
			callback
		);
	}
}

module.exports = Apply_No_Pull_By_Id_Test;
