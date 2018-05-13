/*jslint devel: true*/
/*global window, jQuery, ShoppingCart*/
(function ($) {
    'use strict';

    var tax_rate = 5,
        cart;

    function add_comma(num) {
        var str = String(num).replace(/,/g, '');
        while (str !== (str = str.replace(/^(-?\d+)(\d{3})/, '$1,$2'))) {}
        return str;
    }

    $('form.aspcart-add').submit(function (event) {
        var quantity,
            key = JSON.stringify($.map($(this).serializeArray(), function (item) {
                if (item.name === 'quantity') {
                    quantity = +item.value;
                    return null;
                } else {
                    return [[item.name, item.value]];
                }
            }));

        cart.add_quantity(key, quantity);

        return false;
    });

    $('#clear_cart').click(function (event) {
        if (window.confirm('カートを空にします。GO AHEAD?')) {
            cart.clear();
        }
    });

    $('#order_cart').click(function (event) {
        $(this).attr('disabled', '');
        $('#order_form').slideDown();
    });

    $('input[name=郵便番号]').keyup(function (event) {
        var $this = $(this),
            code = $this.val(),
            match = code.match(/^(\d{3})-?(\d{4})$/);

        if (match) {
            code = [match[1], match[2]].join('-');

            $.get('http://www.google.com/transliterate?jsonp=?&' + $.param({
                langpair: 'ja-Hira|ja',
                text: code
            }), function (data) {
                if (data.length === 1) {
                    var address = data[0][1][0];
                    console.log(['solved address', address]);
                    $('input[name=address1]').val(address);
                } else {
                    console.log('postalcode error');
                }
            }, 'jsonp');
        }
    });

    $('#order_form').submit(function (event) {
        event.preventDefault();

        var cart_info = $.map(cart.get_item_list(), function (item) {
                return [
                    item.product,
                    '@' + add_comma(item.price),
                    'qty:' + item.quantity,
                    'opt:' + JSON.stringify(item.option)
                ].join(', ');
            }).join('\n'),
            ship_info = $.map($(this).serializeArray(), function (item) {
                var name = item.name,
                    value = item.value;

                return [name, value].join(': ');
            }).join('\n');

        console.log(cart_info);
        console.log(ship_info);

        $('<form />', {
            action: 'http://mailform.ptyapp.com/1/send_raw',
            method: 'post'
        }).append(
            $('<input />', {
                type: 'hidden',
                name: 'siteKey',
                value: 'hzLhQXLP4qux'
            }),
            $('<input />', {
                type: 'hidden',
                name: 'emailTo',
                value: $('input[name=メールアドレス]', this).val()
            }),
            $('<input />', {
                type: 'hidden',
                name: 'returnTo',
                value: 'http://ptyapp.com/aspcart/thanks.html?' + $.param({id: cart.id})
            }),
            $('<input />', {
                type: 'hidden',
                name: 'body',
                value: [cart_info, ship_info].join('\n\n')
            })
        ).appendTo('body:last').submit();

        return false;
    });

    function refresh_cart_dump() {
        var sum = 0,
            count = 0,
            $table = $('<table />'),
            item_list = cart.get_item_list();

        $table.append($('<tr />').append(
            $.map(['商品名', '単価', '数量', '小計', 'オプション', '操作'], function (item) {
                return $('<th />', {text: item})[0];
            })
        ));

        $table.append($.map(item_list, function (item) {
            var option_str = JSON.stringify(item.option);

            sum += item.price * item.quantity;
            count += item.quantity;

            return $('<tr />').append(
                $('<td />', {text: item.product}),
                $('<td />', {text: add_comma(item.price), css: {textAlign: 'right'}}),
                $('<td />', {text: item.quantity, css: {textAlign: 'right'}}),
                $('<td />', {text: add_comma(item.price * item.quantity), css: {textAlign: 'right'}}),
                $('<td />', {text: (option_str !== '{}' ? option_str : '')}),
                $('<td />').append(
                    $('<span />', {
                        text: '＋',
                        title: 'increment',
                        click: function (event) {
                            cart.add_quantity(item.key, 1);
                        },
                        css: {
                            cursor: 'pointer'
                        }
                    }),
                    $('<span />', {
                        text: '－',
                        title: 'decrement',
                        click: function (event) {
                            cart.add_quantity(item.key, -1);
                        },
                        css: {
                            cursor: 'pointer'
                        }
                    }),
                    $('<span />', {
                        text: 'del',
                        title: 'delete',
                        click: function (event) {
                            cart.set_quantity(item.key, 0);
                        },
                        css: {
                            cursor: 'pointer'
                        }
                    })
                )
            )[0];
        }));

        $('tr:even', $table).css('background', '#eee');
        $('tr:first', $table).css('background', '#ccc');

        $('#cart-dump').empty();
        $('#cart-dump').append($table);
        $('#cart-dump').append($('<p />', {text: ['商品点数', count].join(': ')}));
        $('#cart-dump').append($('<p />', {text: ['合計(税込)', add_comma(sum.toFixed(0))].join(': ')}));
        $('#cart-dump').append($('<p />', {text: ['内税', add_comma(Math.floor(sum * tax_rate / (100 + tax_rate)))].join(': ')}));
    }

    cart = new ShoppingCart();
    cart.refresh_callback = refresh_cart_dump;
    cart.flush();
}(jQuery));
