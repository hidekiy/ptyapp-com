/*
version: 2012062900
*/

/*jslint browser: true, devel: true */
/*global jQuery*/

(function () {
	'use strict';

	var $ = jQuery,
		$formRoot = $('#contactForm'),
		validatorTable = {
			isFilled: {
				errorMsg: 'ご入力下さい',
				checker: function (text) {
					return text !== '';
				}
			},
			isEmail: {
				errorMsg: '不正なメールアドレスです',
				checker: function (text) {
					return text === '' || (text.match(/@/g) || []).length === 1;
				}
			}
		};

	function onBlurGenerator(key) {
		var validator = validatorTable[key];

		return function () {
			var $this = $(this),
				$errorMsg = $this.siblings('.mailform_error_msg_' + key);

			if ($errorMsg.length === 0) {
				$errorMsg = $('<span />', {
					'class': 'mailform_error_msg mailform_error_msg_' + key
				}).insertAfter($this);
			}

			if (!validator.checker($this.val())) {
				$errorMsg.text(validator.errorMsg).show();
			} else {
				$errorMsg.hide();
			}

			if ($this.siblings('.mailform_error_msg:visible').length > 0) {
				$this.addClass('mailform_invalid');
			} else {
				$this.removeClass('mailform_invalid');
			}
		};
	}

	$formRoot.find('.mailform_required')
		.blur(onBlurGenerator('isFilled'));

	$formRoot.find('input[name=メールアドレス]')
		.blur(onBlurGenerator('isEmail'));

	$formRoot.submit(function () {
		var emailTo = $('input[name=メールアドレス]', this).val(),
			formattedForm;

		$('.mailform_required', this).blur();

		if ($('.mailform_invalid', this).length > 0) {
			alert('ご記入漏れがあります。赤色になっている入力項目をご確認ください。');
			return false;
		}

		formattedForm = $.map($(this).serializeArray(), function (item) {
			var name = item.name,
				value = item.value;

			if (value === '') {
				return;
			}

			return ['[', name, '] ', value].join('');
		}).join('\n');

		$.post('sendmail-api.php', {
			emailTo: emailTo,
			body: formattedForm
		}).done(function () {
			$formRoot.slideUp(function () {
				$('<p />', {
					text: '正常に送信しました。確認メールを送信いたしましたのでご確認ください。'
				}).insertAfter($formRoot);
			});
		}).fail(function (jqXHR) {
//			console.log(jqXHR);
			$('input[type=submit]', $formRoot)
				.attr('disabled', null)
				.val(['送信に失敗しました(', jqXHR.status, ') クリックして再送信'].join(''));
		});

		$('input[type=submit]', this)
			.attr('disabled', 'disabled')
			.val('送信しています ...');

		return false;
	});

}());
