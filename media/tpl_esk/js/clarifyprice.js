(function ($) {
	'use strict';

	function Clarify(element, config)
	{
		this.element = $(element);
		let self = this;

		$.extend(self, config);
		config = _config.get(element.id);
		$.extend(self, config);

		self.model = new Modal(self.element, self);

		self.model.on('render_body', function () {
			var modal = this;

			modal.input_name = $('<input />', {
				class: 'modal-input',
				placeholder: modal.language.hint_name,
				type: 'text'
			});

			modal.input_phone = $('<input />', {
				class: 'modal-input', name: 'phone',
				placeholder: modal.language.hint_phone,
				type: 'text'
			});

			modal.input_email = $('<input />', {
				class: 'modal-input', name: 'email',
				placeholder: modal.language.hint_email,
				type: 'text'
			});

			modal.input_comment = $('<textarea />', {
				placeholder: modal.language.hint_comment,
				class: 'modal-input'
			});

			modal.btn_send = $('<button />', {
				html: modal.language.btn_send,
				class: 'modal-formzakaz-btn',
				type: 'button'
			});

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
							name: modal.input_name.val(),
							phone: Number(phone),
							email: modal.input_email.val(),
							message: modal.input_comment.val(),
							task: modal.ajax_task,
							format: 'json', id: self.id
						};

					if (modal.hasOwnProperty('module_id'))
					{
						data.id = Number(modal.module_id);
					}
					else if (self.hasOwnProperty('id'))
					{
						data.id = Number(self.id);
					}

					$.ajax({
						data: data,
						method: 'POST',
						dataType: 'json',
						success: function (result) {
							if (result.success !== true)
							{
								alert(result.message);
								return;
							}

							modal.form.replaceWith($('<div />', {
								class: 'success-text',
								html: result.message
							}));

							if (typeof ym !== 'undefined')
							{
								ym(modal.ym_counter, 'reachGoal', modal.ym_name);
							}

							if (typeof gtag !== 'undefined')
							{
								gtag('event', modal.ym_name, { 'event_category': modal.gtag_category });
							}
						},
						complete: function () {
							modal.loader.stop();
						}
					});
				});
			});

			modal.form = $('<form />', {
				html: [
					$('<div />', {
						class: 'modal-group-input',
						html: modal.input_name
					}),
					$('<div />', {
						class: 'modal-group-input',
						html: modal.input_phone
					}),
					$('<div />', {
						class: 'modal-group-input',
						html: modal.input_email
					}),
					$('<div />', {
						class: 'modal-group-input',
						html: modal.input_comment
					}),
					modal.btn_send,
					$('<div />', {
						class: 'modal-personal-data',
						html: modal.language.personal_data.replace(
							/%s/g, modal.language.btn_send
						)
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
					},
					email: {
						email: true
					}
				},
				submitHandler: function () {
					return false;
				}
			});

			modal.loader = new $.fn.Loader(modal.btn_send.get(0));
		});
	};

	let map_item = function (el, config)
	{
		let data = new Clarify(el, config);
		$(el).data('clarify', data);
	};

	$.fn.clarify = function (config)
	{
		this.each(function () {
			map_item(this, config);
		});
	};

	$(document).ready(function () {
		$('.btn-clarify').clarify(map_item);
	});

})(jQuery);