/*global window, jQuery, ASPMAILFORM_SETTINGS*/

(function ($) {
    'use strict';
    var setting = ASPMAILFORM_SETTINGS;

    if (!window.console) {
        window.console = {log: function () {}};
    }

    console.log('setting', setting);

    if (!setting || !setting.siteKey || !setting.returnTo) {
        $('input, textarea, select', '#contact_form').attr('disabled', 1);

        (function () {
            var msg;

            if (!setting) {
                msg = '設定が見つかりません。';
            } else if (!setting.siteKey) {
                msg = 'siteKeyがありません。';
            } else if (!setting.returnTo) {
                msg = 'returnToがありません。';
            } else {
                msg = '';
            }

            $('<p />', {text: '設定 (ASPMAILFORM_SETTINGS) にエラーがあります。フォームは無効になりました。' + msg})
                .prependTo('#contact_form');
        }());
    }

    $('#contact_form .mailform_is_required').blur(function (event) {
        var $this = $(this),
            $error_msg = $this.siblings('.mailform_error_msg');

        if ($error_msg.length === 0) {
            $error_msg = $('<span />', {
                'class': 'mailform_error_msg note',
                css: {
                    margin: '0 10px',
                    color: 'red'
                }
            }).insertAfter($this);
        }

        if ($this.val() === '') {
            $this.css('background', '#fee');
            $this.addClass('mailform_is_invalid');
            $error_msg.text('ご入力下さい').show();
        } else {
            $this.css('background', 'white');
            $this.removeClass('mailform_is_invalid');
            $error_msg.hide();
        }
    });

    $('#contact_form').submit(function (event) {
        $('.mailform_is_required', this).blur();

        if ($('.mailform_is_invalid', this).length > 0) {
            window.alert('ご記入漏れがあります。赤色になっている入力項目をご確認ください。');
            return false;
        }

        var contact_info = $.map($(this).serializeArray(), function (item) {
                var name = item.name,
                    value = item.value;

                return [name, value].join(': ');
            }).join('\n');

        $('<form />', {
            action: 'http://mailform.ptyapp.com/1/send_raw',
            method: 'post'
        }).append(
            $('<input />', {
                type: 'hidden',
                name: 'siteKey',
                value: setting.siteKey
            }),
            $('<input />', {
                type: 'hidden',
                name: 'emailTo',
                value: $('input[name=メールアドレス]', this).val()
            }),
            $('<input />', {
                type: 'hidden',
                name: 'returnTo',
                value: setting.returnTo
            }),
            $('<input />', {
                type: 'hidden',
                name: 'body',
                value: contact_info
            })
        ).appendTo('body').submit();

        return false;
    });

}(jQuery));
