/*
 * Copyright (c) 2012 ptyapp.com. All rights reserved.
 */

(function () {
	'use strict';

	var $ = jQuery;

	function encode(s) {
		return $.map(s.split(''), function (a, i) {
			return [a, 'p', 'a'];
		});
	}

	function decode(l) {
		return $.map(l, function (a, i) {
			if (i % 3 === 0) {
				return a;
			} else {
				return null;
			}
		}).join('');
	}

	$('#contactUs').attr('href', decode(["m", "p", "a", "a", "p", "a", "i", "p", "a", "l", "p", "a", "t", "p", "a", "o", "p", "a", ":", "p", "a", "i", "p", "a", "n", "p", "a", "f", "p", "a", "o", "p", "a", "@", "p", "a", "p", "p", "a", "t", "p", "a", "y", "p", "a", "a", "p", "a", "p", "p", "a", "p", "p", "a", ".", "p", "a", "c", "p", "a", "o", "p", "a", "m", "p", "a"]));
}());
