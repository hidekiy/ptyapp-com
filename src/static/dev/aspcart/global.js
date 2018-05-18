/*global window, jQuery*/
(function ($) {
    'use strict';
    var cookies = jQuery.cookies,
        cookie_key = 'ASPCART',
        revision = '20110915';

    if (!window.console) {
        window.console = {log: function () {}};
    }

    cookies.setOptions({
        expiresAt: new Date(+new Date() + 2 * 24 * 3600 * 1000)
    });

    function ShoppingCart() {
        this.qtable = {};
        this.refresh_callback = null;
        this.load_cookie();

        if (!this.id) {
            this.id = +new Date() % 10000;
        }
    }
    ShoppingCart.prototype.get_item_list = function () {
        function qtable_item_parser(serializedList, quantity) {
            var item = {
                quantity: quantity,
                key: serializedList,
                option: {}
            };

            $.each(JSON.parse(serializedList), function () {
                var k = this[0],
                    v = this[1];

                if ($.inArray(k, ['product', 'price', 'quantity']) > -1) {
                    item[k] = v;
                } else {
                    item.option[k] = v;
                }
            });

            return item;
        }

        var item_list = $.map(this.qtable, function (v, k) {
            return qtable_item_parser(k, v);
        });

        item_list.sort(function (a, b) {
            if (a.product === b.product) {
                return a.quantity > b.quantity ? -1 : 1;
            } else {
                return a.product > b.product ? 1 : -1;
            }
        });

        return item_list;
    };
    ShoppingCart.prototype.set_quantity = function (key, quantity) {
        this.qtable[key] = quantity;

        if (!this.qtable[key]) {
            delete this.qtable[key];
        }

        this.flush();
    };
    ShoppingCart.prototype.add_quantity = function (key, amount) {
        if (!this.qtable[key]) {
            this.qtable[key] = 0;
        }

        this.qtable[key] += amount;

        if (!this.qtable[key]) {
            delete this.qtable[key];
        }

        this.flush();
    };
    ShoppingCart.prototype.clear = function () {
        this.qtable = {};
        this.flush();
    };
    ShoppingCart.prototype.flush = function () {
        this.save_cookie();

        if (this.refresh_callback) {
            this.refresh_callback();
        }
    };
    ShoppingCart.prototype.save_cookie = function () {
        if (JSON.stringify(this.qtable) !== '{}') {
            cookies.set(cookie_key, {
                qtable: this.qtable,
                id: this.id,
                revision: revision
            });
            console.log('save_cookie: ok');
        } else {
            cookies.del(cookie_key);
            console.log('save_cookie: deleted');
        }
    };
    ShoppingCart.prototype.load_cookie = function () {
        var cookie = cookies.get(cookie_key);

        if (cookie && cookie.revision === revision) {
            console.log('load_cookie: revision ok');

            if (cookie.qtable) {
                this.qtable = cookie.qtable;
            }
            if (cookie.id) {
                this.id = cookie.id;
            }
        }
    };

    window.ShoppingCart = ShoppingCart;
}(jQuery));
