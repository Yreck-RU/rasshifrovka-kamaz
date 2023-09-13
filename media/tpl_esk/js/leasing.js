(function ($) {
	'use strict';

	function Leasing(element, config)
	{
		this.element = $(element);
		let self = this;

		$.extend(self, config);
		config = _config.get(element.id);
		$.extend(self, config);

		self.model = new Modal(self.element, self);

		self.model.on('before_show', function () {
			this.modal_dialog.addClass('modal-product-leasing');
		});

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

			modal.div_term = $('<div />');
			modal.div_contribution = $('<div />');

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
							term: modal.div_term.slider('value'),
							contribution: modal.div_contribution.slider('value'),
							task: modal.ajax_task,
							format: 'json', id: self.id
						};

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
								ym(38120235, 'reachGoal', 'leasing')
							}

							if (typeof gtag !== 'undefined')
							{
								gtag('event', 'leasing', { 'event_category': 'product' });
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
						html: [
							$('<label />', {
								class: 'modal-group-label required',
								html: self.language.label_term
							}),
							modal.div_term
						]
					}),
					$('<div />', {
						class: 'modal-group-input',
						html: [
							$('<label />', {
								class: 'modal-group-label required',
								html: self.language.label_contribution
							}),
							modal.div_contribution
						]
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

			modal.div_term.slider({
				min: 12, max: 60,
				values: 12,
				create: function () {
					$(this).find('.ui-slider-handle').html(12);
				},
				slide: function (event, ui) {
					$(ui.handle).html(ui.value);
				}
			});

			modal.div_term.slider('float', {
				pips: true, handle: false
			});

			modal.div_term.slider('pips', {
				rest: false
			});

			modal.div_contribution.slider({
				min: 5, max: 45,
				values: 5,
				create: function () {
					$(this).find('.ui-slider-handle').html(5);
				},
				slide: function (event, ui) {
					$(ui.handle).html(ui.value);
				}
			});

			modal.div_contribution.slider('float', {
				pips: true, handle: false
			});

			modal.div_contribution.slider('pips', {
				rest: false
			});

			modal.loader = new $.fn.Loader(
				modal.btn_send.get(0)
			);
		});
	};

	let map_item = function (el, config)
	{
		let data = new Leasing(el, config);
		$(el).data('leasing', data);
	};

	$.fn.leasing = function (config)
	{
		this.each(function () {
			map_item(this, config);
		});
	};

	$(document).ready(function () {
		$('.btn-product-leasing').leasing();
	});

})(jQuery);