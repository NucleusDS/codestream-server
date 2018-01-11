// Provides an abstract base class to use for models that should be part of a DataCollection
// Doesn't have much practical use unless derived from

'use strict';

var DataModelValidator = require('./data_model_validator');
var DeepClone = require(process.env.CS_API_TOP + '/server_utils/deep_clone');

class DataModel {

	constructor (attributes) {
		this.attributes = {};
		this.setDefaults();	// set defaults, and _then_ apply the attributes as given (which might overwrite defaults)
		Object.assign(this.attributes, DeepClone(attributes || {}));	// make a deep copy of all attributes
		this.id = this.attributes._id;	// establish an ID field for convenience
		this.validator = this.getValidator();	// validator engine
	}

	// get the validator engine to use to validate attributes
	// override to provide a validator engine with additional validator functions
	getValidator () {
		return new DataModelValidator();
	}

	// set default attributes
	setDefaults (/*attributes*/) { }

	// called right before the model is saved
	preSave (callback, options) {
		// validate myself
		this.validate(callback, this.attributes, options);
	}

	// validate this model or a set of attributes passed in
	validate (callback, attributes, options) {
		attributes = attributes || this.attributes;
		// pass this on to the validator engine, which does the dirty work
		this.validator.validate(
			attributes,
			(errors, warnings) => {
				this.handleValidation(errors, warnings, options, callback);
			},
			options
		);
	}

	// handle the response from a validation call
	handleValidation (errors, warnings, options, callback) {
		// for errors, these generate an error up the chain
		if (errors) {
			if (!(errors instanceof Array)) {
				errors = [errors];
			}
			return callback(errors);
		}
		// for warnings, we'll be quiet about it, but the caller should probably log them,
		// or do SOMETHING anyway ... cause warnings are important, right?
		if (warnings) {
			if (!(warnings instanceof Array)) {
				warnings = [warnings];
			}
			this.validationWarnings = warnings;
		}
		process.nextTick(callback);
	}

	// getter for an attribute
	get (attribute) {
		return this.attributes[attribute];
	}

	// setter for an attribute, can either set a single value or several values passed as an object
	set (attribute, value) {
		let attributes = {};
		if (typeof attribute === 'string') {
			attributes[attribute] = value;
		}
		else if (typeof attribute === 'object') {
			attributes = attribute;
		}
		Object.assign(this.attributes, attributes);
	}

	// get a sanitized version of this model, as an object ... with attributes not to be served to clients
	getSanitizedObject () {
		return this.validator.getSanitizedObject(this);
	}

	// sanitize this model, removing all attributes that should not be served to clients
	sanitize () {
		return this.validator.sanitizeModel(this);
	}
}

module.exports = DataModel;
