(function ($) {
	'use strict';

	function Feedback(element)
	{
		let config = _config.get(element.id);
		$.extend(this, config);

		this.element = $(element);
		let self = this;

		if (self.hasOwnProperty('title'))
		{
			self.header_block = $('<div />', {
				class: 'feedback-header'
			});

			self.element.append(self.header_block);

			self.title_block = $('<h2 />', {
				html: self.title
			});

			self.header_block.append(self.title_block);
		}

		self.form = $('<form />', {
			onsubmit: 'return false;'
		});

		self.element.append(self.form);

		self.alert_container = $('<div />', {
			class: 'alert-container',
			css: { display: 'none' }
		});

		self.form.append(self.alert_container);

		self.name_field = $('<input />', {
			type: 'text',
			placeholder: self.language.hint_name_input
		});

		self.form.append($('<div />', {
			class: 'form-field-block',
			html: self.name_field
		}));

		self.phone_field = $('<input />', {
			type: 'text', name: 'phone',
			placeholder: self.language.hint_phone_input
		});

		self.form.append($('<div />', {
			class: 'form-field-block',
			html: self.phone_field
		}));

		self.emial_field = $('<input />', {
			type: 'text', name: 'email',
			placeholder: self.language.hint_email_input
		});

		self.form.append($('<div />', {
			class: 'form-field-block',
			html: self.emial_field
		}));

		self.message_field = $('<textarea />', {
			placeholder: self.language.hint_message_input
		});

		self.form.append($('<div />', {
			class: 'form-field-block',
			html: [
				$('<div />', {
					class: 'message-info',
					html: self.language.message
				}),
				self.message_field
			]
		}));

		self.btn_send = $('<button />', {
			type: 'button',
			class: 'button-feedback-send',
			html: self.language.btn_send
		});

		self.form.append($('<div />', {
			class: 'form-button-send',
			html: self.btn_send
		}));

		self.form.append($('<div />', {
			class: 'form-personal-data',
			html: self.language.personal_data
		}));

		self.phone_field.inputmasks({
			inputmask: {
				definitions: {
					'#': {
						validator: '[0-9]',
						cardinality: 1
					},
					showMaskOnHover: true,
					autoUnmask: true
				}
			},
			replace: '#',
			listKey: 'mask',
			match: /[0-9]/,
			list: window._config.get('formates')
		});

		self.validate = self.form.validate({
			errorClass: 'validate-error',
			errorPlacement: function (error, element) {
				error.insertAfter(element);
			},
			rules: {
				phone: {
					required: true
				},
				email: {
					email: true
				}
			},
			submitHandler: function () {
				return false;
			}
		});

		self.loader = new $.fn.Loader(self.btn_send.get(0));

		self.btn_send.on('click', function () {

			if (self.hasOwnProperty('alert')) {
				self.alert.remove();
				delete self.alert;
			}

			self.form.attr('onsubmit', 'return false;');

			if (self.form.valid() === false)
			{
				return;
			}

			self.alert_container.empty();
			self.loader.start();

			window.captcha.trigger(function (token) {
				var phone = self.phone_field.val(),
					phone = phone.replace(/[^0-9]/g, ''),
					data = {
						'g-recaptcha-response': token,
						id: self.module_id,
						name: self.name_field.val(),
						phone: Number(phone),
						email: self.emial_field.val(),
						message: self.message_field.val(),
						option: 'com_ajax',
						module: 'feedback',
						method: 'submit',
						format: 'json'
					};

				$.ajax({
					data: data,
					method: 'POST',
					dataType: 'json',
					success: function (result) {
						if (result.success !== true)
						{
							let alert_error = $('<div />', {
								class: 'alert alert-error',
								html: result.message
							});

							self.alert_container.html(alert_error);
							self.alert_container.removeAttr('style');

							return;
						}

						self.form.replaceWith($('<div />', {
							class: 'success-text',
							html: result.message
						}));

						if (typeof ym !== 'undefined')
						{
							ym(38120235, 'reachGoal', 'forma')
						}

						if (typeof gtag !== 'undefined')
						{
							gtag('event', 'forma', { 'event_category': 'glavnaya' });
						}
					},
					complete: function () {
						self.loader.stop();
					}
				});
			});
		});

		self.element.removeClass('loader');
	};

	Feedback.prototype.renderMessage = function (result)
	{
		var self = this;

		self.alert = $('<div />', {
			class: 'alert-container',
			html: $('<div />', {
				class: 'alert alert-error',
				html: result.message
			})
		});

		self.title_block.after(self.alert);
	};

	$.fn.feedback = function ()
	{
		this.each(function () {
			let data = $(this).data();
			data.feedback = new Feedback(this);
		});
	};

})(jQuery);
