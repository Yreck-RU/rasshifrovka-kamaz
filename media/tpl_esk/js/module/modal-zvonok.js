(function ($) {
	'use strict';

	function ModalZvonok(element)
	{
		$.extend(this, window._config.get(element.id));

		this.element = $(element);
		var self = this;

		self.model = new Modal(element, {
			language: self.language
		});

		self.model.on('render_body', function () {
			var modal = this;

			modal.input_phone = $('<input />', {
				class: 'modal-input',
				placeholder: modal.language.hint_phone,
				type: 'text', name: 'phone'
			});

			modal.btn_send = $('<button />', {
				type: 'button',
				class: 'modal-formzakaz-btn',
				html: modal.language.btn_send
			});

			modal.form = $('<form />', {
				html: [
					$('<div />', {
						class: 'modal-group-input',
						html: modal.input_phone
					}),
					modal.btn_send,
					$('<div />', {
						class: 'modal-personal-data',
						html: modal.language.personal_data
					})
				]
			});

			modal.modal_body.html(modal.form);

			modal.input_phone.inputmasks({
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

			modal.validate = modal.form.validate({
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

			modal.loader = new $.fn.Loader(modal.btn_send.get(0));

			modal.btn_send.on('click', function () {
				modal.form.attr('onsubmit', 'return false;');

				if (modal.form.valid() === false)
				{
					return;
				}

				modal.loader.start();

				window.captcha.trigger(function (token) {
					var phone = modal.input_phone.val(),
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

							modal.form.replaceWith($('<div />', {
								class: 'success-text',
								html: result.message
							}));

							if (typeof ym !== 'undefined')
							{
								ym(38120235, 'reachGoal', 'zvonok');
							}

							if (typeof gtag !== 'undefined')
							{
								gtag('event', 'zvonok', { 'event_category': 'shapka' });
							}
						},
						complete: function () {
							modal.loader.stop();
						}
					});
				});
			});
		});
	};

	$.fn.modalzvonok = function ()
	{
		return this.each(function ()
		{
			var data = $(this).data('modalzvonok');

			if (typeof data === 'undefined')
			{
				data = new ModalZvonok(this);
				$(this).data('modalzvonok', data);
			}
		});
	};

})(jQuery);
