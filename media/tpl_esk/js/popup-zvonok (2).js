(function ($) {
	'use strict';

	function PopupZvonok(config) {
		this.element = $('<button />', {
			type: 'button'
		});

		$.extend(this, config);
		var self = this;

		self.model = new Modal(self.element, self);

		self.model.on('render_body', function () {
			var modal = this;

			modal.modal_content.addClass('popup-zvonok');

			modal.input_phone = $('<input />', {
				class: 'modal-input phone', name: 'phone',
				placeholder: modal.language.hint_phone,
				type: 'text'
			});

			modal.btn_send = $('<button />', {
				html: modal.language.btn_send,
				class: 'modal-formzakaz-btn',
				type: 'button'
			});

			modal.btn_close = $('<button />', {
				html: modal.language.btn_close,
				class: 'modal-close-btn',
				type: 'button'
			});

			modal.btn_send.on('click', function () {
				modal.form.attr('onsubmit', 'return false;');

				if (modal.form.valid() === false) {
					return;
				}

				modal.send_loader.start();

				window.captcha.trigger(function (token) {
					var phone = modal.input_phone.val(),
						phone = phone.replace(/[^0-9]/g, ''),
						data = {
							'g-recaptcha-response': token,
							phone: Number(phone),
							task: 'ajax.popup_zvonok',
							format: 'json'
						};

					$.ajax({
						data: data,
						method: 'POST',
						dataType: 'json',
						success: function (result) {
							if (result.success !== true) {
								alert(result.message);
								return;
							}

							modal.form.replaceWith($('<div />', {
								class: 'success-text',
								html: result.message
							}));

							if (typeof ym !== 'undefined') {
								ym(38120235, 'reachGoal', 'popup')
							}

							if (typeof gtag !== 'undefined') {
								gtag('event', 'popup', { 'event_category': 'glavnaya' });
							}
						},
						complete: function () {
							modal.send_loader.stop();
						}
					});
				});
			});

			modal.btn_close.on('click', function () {
				modal.model.trigger('hide');

				$.ajax({
					data: {
						option: 'com_shop',
						task: 'ajax.more_show_popup',
						format: 'json'
					},
					method: 'POST',
					dataType: 'json',
					success: function (result) {
						if (result.success !== true) {
							alert(result.message);
							console.error(result.message);

							return;
						}
					}
				});
			});

			modal.form = $('<form />', {
				html: [
					$('<div />', {
						class: 'modal-group-input',
						html: modal.input_phone
					}),
					$('<div />', {
						class: 'modal-introtext-input',
						html: modal.language.text,
						css: {
							'text-align': 'center'
						}
					}),
					modal.btn_send,
					$('<div />', {
						class: 'modal-personal-data',
						html: modal.language.personal_data.replace(
							/%s/g, modal.language.btn_send
						)
					}),
					$('<div />', {
						html: modal.btn_close,
						css: {
							display: 'flex',
							'justify-content': 'end'
						}
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

			modal.send_loader = new $.fn.Loader(
				modal.btn_send.get(0)
			);
		});

		self.time = parseInt(+new Date() / 1000);

		if (config.enabled === true) {
			self.timeid = setInterval(self.runInterval, 1000, self);
		}
	};

	PopupZvonok.prototype.runInterval = function (self) {
		const now_time = parseInt(+new Date() / 1000);

		if ((now_time - self.time) >= self.timeout) {
			clearInterval(self.timeid);
			self.element.trigger('click');
		}
	};

	$(document).ready(function () {
		var config = _config.get('popup-zvonok');
		window.popup = new PopupZvonok(config);
	});

})(jQuery);