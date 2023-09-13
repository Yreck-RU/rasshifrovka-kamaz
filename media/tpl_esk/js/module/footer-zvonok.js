(function ($) {
	'use strict';

	function FooterZvonok(element)
	{
		$.extend(this, _config.get(element.id));

		this.element = $(element);
		var self = this;

		self.input_phone = self.element.find(
			'input#' + self.input_phone_id
		);

		self.input_phone.inputmasks({
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

		self.validate = self.element.validate({
			errorClass: 'validate-error',
			errorPlacement: function (error, element) {
				error.insertAfter(element);
			},
			rules: {
				phone: {
					required: true
				}
			},
			submitHandler: function () {
				return false;
			}
		});

		self.btn_send = self.element.find(
			'button#' + self.btn_send_id
		);

		self.loader = new $.fn.Loader(
			self.btn_send.get(0)
		);

		self.btn_send.on('click', function () {
			self.submit_form();
		});
	};

	FooterZvonok.prototype.submit_form = function ()
	{
		var self = this;

		if (self.hasOwnProperty('alert'))
		{
			self.alert.remove();
			delete self.alert;
		}

		self.element.attr('onsubmit', 'return false;');

		if (self.element.valid() === false)
		{
			return;
		}

		self.loader.start();

		window.captcha.trigger(function (token) {
			var phone = self.input_phone.val(),
				phone = phone.replace(/[^0-9]/g, ''),
				data = {
					'g-recaptcha-response': token,
					id: self.module_id,
					phone: Number(phone),
					option: 'com_ajax',
					module: 'form_zvonok',
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
						alert(result.message);
						console.error(result.message);

						return;
					}

					self.element.replaceWith($('<div />', {
						class: 'success-text',
						html: result.message
					}));

					if (typeof ym !== 'undefined')
					{
						ym(38120235, 'reachGoal', 'footer')
					}

					if (typeof gtag !== 'undefined')
					{
						gtag('event', 'footer', { 'event_category': 'glavnaya' });
					}
				},
				complete: function () {
					self.loader.stop();
				}
			});
		});
	};

	$.fn.footerzvonok = function ()
	{
		return this.each(function ()
		{
			var data = new FooterZvonok(this);
			$(this).data('footerzvonok', data);
		});
	};

})(jQuery);
