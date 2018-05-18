/*
 * Copyright (c) 2012 ptyapp.com. All rights reserved.
 */

/*jslint browser: true, devel: true */
/*global WebFont, jQuery */

(function () {
	'use strict';

	var $ = jQuery,
		originalTitle = document.title,
		queryParam;

/*
?font=hoge&h24

	font = 'Habibi';
	font = 'Tangerine';
	font = 'Playball';
	font = 'Spicy Rice';
	font = 'Overlock SC';
	font = 'Medula One';
	font = 'Sofia';
	font = 'Armata';
*/

	function parseQueryParam(param) {
		var table = {};

		$.each(param.split('&'), function () {
			var list = this.split('='),
				key = list[0],
				val = list[1] || '';

			table[key] = decodeURIComponent(val);
		});

		return table;
	}

	$(window).resize(function () {
		var $window = $(window),
			height = $window.height(),
			origClockTime = $('#clock-time').text(),
			i;

		$('#clock').css('width', null);
		$('#clock-time').text(origClockTime.replace(/\d/, '8'));

		for (i = 0; i < 100; i += 1) {
			$('#clock-main').css('fontSize', height + 'px');

			if ($('#clock-main').width() < $window.width() - 50) {
				break;
			} else {
				height *= 0.95;
			}
		}

		if ($(document).height() <= $(window).height()) {
			$('#clock-date').show();
		} else {
			$('#clock-date').hide();
		}

		$('#clock-date').css('fontSize', (height * 0.25) + 'px');
		$('#clock-time').text(origClockTime);
		$('#clock').css({
			marginTop: (($window.height() - height) * 0.25) + 'px',
			width: $('#clock-main').width() + 'px'
		});
	});

	function refreshText() {
		var now = new Date(),
			timeStr,
			ampmStr,
			dateStr = [now.getYear() + 1900, now.getMonth() + 1, now.getDate()].join('.'),
			origClockTime = $('#clock-time').text(),
			titleStr;

		if (queryParam.h24) {
			timeStr  = [
				now.getHours(),
				':',
				('0' + now.getMinutes()).slice(-2)
			].join('');
			ampmStr = '';
		} else {
			timeStr  = [
				now.getHours() % 12,
				':',
				('0' + now.getMinutes()).slice(-2)
			].join('');
			ampmStr = (now.getHours() >= 12) ? 'pm' : 'am';
		}

		titleStr = [timeStr, ampmStr, ' - ', originalTitle].join('');

		if (timeStr !== origClockTime) {
			$('#clock-time').text(timeStr);
			$('#clock-ampm').text(ampmStr);
			$('#clock-date').text(dateStr);
			document.title = titleStr;

			if (origClockTime.length !== timeStr.length) {
				$(window).resize();
			}
		}
	}


	queryParam = parseQueryParam(document.location.search.slice(1));

	if (window.console) {
		console.log('queryParam', queryParam);
	}

	(function () {
		var font = queryParam.font;

		if (font) {
			if (font.match(/^[a-zA-Z \-]+$/)) {
				WebFont.load({
					google: {
						families: [font]
					},
					active: function () {
						$('#clock').css('fontFamily', ["'", font, "'"].join(''));
						setInterval(refreshText, 1000);
						refreshText();
					},
					inactive: function () {
						$('#error').text(['loading font:', font, ' is failed.'].join(''));
					}
				});
			} else {
				$('#error').text('invalid font name.');
			}
		} else {
			setInterval(refreshText, 1000);
			refreshText();
		}
	}());

}());
