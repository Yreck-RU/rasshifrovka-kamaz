(function ($) {
	'use strict';

	function Faq(element)
	{
		this.element = $(element);
		let self = this;

		let config = _config.get(element.id);
		$.extend(self, config);

		self.field_name = $('<input />', {
			type: 'text', name: 'name',
			placeholder: self.language.field_name,
		});

		self.element.append($('<div />', {
			class: 'form-field-name',
			html: self.field_name
		}));

		self.field_phone = $('<input />', {
			type: 'text', name: 'phone',
			placeholder: self.language.field_phone
		});

		self.element.append($('<div />', {
			class: 'form-field-phone',
			html: self.field_phone
		}));

		self.field_email = $('<input />', {
			type: 'text', name: 'email',
			placeholder: self.language.field_email
		});

		self.element.append($('<div />', {
			class: 'form-field-email',
			html: self.field_email
		}));

		self.field_message = $('<textarea />', {
			name: 'message', rows: 6,
			placeholder: self.language.field_message,
			class: 'form-field-message'
		});

		self.element.append($('<div />', {
			class: 'form-field-message',
			html: self.field_message
		}));

		self.btn_send = $('<button />', {
			type: 'button', class: 'form-btn-send',
			html: self.language.btn_send
		});

		self.element.append(self.btn_send);

		self.element.append($('<div />', {
			class: 'form-personal-data',
			html: self.language.personal_data
		}));

		self.field_phone.inputmasks({
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

		self.btn_send.on('click', function () {
			self.send_form();
		});

		self.loader = new $.fn.Loader(
			self.btn_send.get(0)
		);

		self.validate = self.element.validate({
			errorClass: 'validate-error',
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
	};

	Faq.prototype.send_form = function ()
	{
		let self = this;

		self.element.attr('onsubmit', 'return false;');

		if (self.element.valid() === false)
		{
			return;
		}

		self.loader.start();
		
		window.captcha.trigger(function (token) {
			var phone = self.field_phone.val(),
				phone = phone.replace(/[^0-9]/g, ''),
				data = new FormData;

			data.append('g-recaptcha-response', token);
			data.append('phone', Number(phone));

			if (String(self.field_name.val()).length > 0)
			{
				data.append('name', self.field_name.val());
			}

			if (String(self.field_email.val()).length > 0)
			{
				data.append('email', self.field_email.val());
			}

			if (String(self.field_message.val()).length > 0)
			{
				data.append('message', self.field_message.val());
			}

			data.append('task', 'ajax.faq');
			data.append('format', 'json');

			$.ajax({
				data: data,
				method: 'POST',
				dataType: 'json',
				processData: false,
				contentType: false,
				success: function (result) {
					if (result.success !== true)
					{
						alert(result.message);
						console.error(result.message);

						return;
					}

					self.element.replaceWith($('<div />', {
						class: 'faq-success',
						html: result.message
					}));
				},
				complete: function () {
					self.loader.stop();
				}
			});
		});
	};

	$.fn.faq = function ()
	{
		this.each(function () {
			let data = $(this).data();
			data.faq = new Faq(this);
		});
	};

})(jQuery);