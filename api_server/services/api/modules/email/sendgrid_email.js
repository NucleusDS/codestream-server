'use strict';

var SendGrid = require('sendgrid');
var Error_Handler = require(process.env.CS_API_TOP + '/lib/util/error_handler');
const Errors = require('./errors');

class SendGrid_Email {

	constructor (options) {
		Object.assign(this, options);
		this.sendgrid = SendGrid(this.api_key);
		this.error_handler = new Error_Handler(Errors);
	}

	send_email (options, callback) {
		let request = this.create_mail_request(options);
		if (this.block) {
			if (options.request) {
				options.request.log(`Would have sent to ${options.to}: ${options.subject}`);
			}
			return process.nextTick(callback);
		}
		this.sendgrid.API(
			request,
			(error, response) => {
				if (error) {
					return callback(this.error_handler.error('email', { reason: `error calling sendgrid API: ${error}` }));
				}
				else if (response.statusCode >= 300) {
					return callback(this.error_handler.error('email', { reason: `got status ${response.statusCode} calling sendgrid API` }));
				}
		  		callback();
			}
		);
	}

	create_mail_request (options) {
		let mail = this.create_mail_object(options);
		return this.sendgrid.emptyRequest({
			method: 'POST',
			path: this.url,
			body: mail.toJSON(),
		});
	}

	create_mail_object (options) {
		let helper = SendGrid.mail;
		let from_email = new helper.Email(options.from);
		let subject = options.subject || '';
		let to = options.to;
		if (this.divert_to && !this.block) {
			subject = `{{{${to}}}} ${subject}`;
			to = this.divert_to;
			if (options.request) {
				options.request.log(`Diverting to ${to}`);
			}
		}
		let to_email = new helper.Email(to);
		let content = new helper.Content('text/html', options.content || '<html></html>');
		let mail = new helper.Mail(from_email, subject || '', to_email, content);
		Object.keys(options.fields || {}).map(field => {
			mail.personalizations[0].addSubstitution(
				new helper.Substitution(
			  		'{{' + field + '}}',
			 		options.fields[field]
				)
			);
		});
		mail.setTemplateId(options.template_id);
		return mail;
	}
}

module.exports = SendGrid_Email;
