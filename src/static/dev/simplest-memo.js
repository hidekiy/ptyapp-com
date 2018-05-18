/*
 * Copyright (c) 2012 ptyapp.com. All rights reserved.
 */

/*global window, jQuery, ZeroClipboard*/

(function () {
	'use strict';

	var $ = jQuery,
		localStorage = window.localStorage,
		periodicSave;

	ZeroClipboard.config({
		cacheBust: true,
		moviePath: 'http://cdnjs.cloudflare.com/ajax/libs/zeroclipboard/1.3.5/ZeroClipboard.swf',
		trustedDomains: ['http://ptyapp.com', 'http://cdnjs.cloudflare.com']
	});

	$('#command-clear').click(function () {
		if ($('textarea').val() !== '' && window.confirm('clear?')) {
			$('textarea').val('');
			periodicSave();
		}
	});

	(function () {
		var previousText;

		if (localStorage) {
			previousText = localStorage.getItem('text');
			periodicSave = function () {
				var text = $('textarea').val();

				if (text === '') {
					localStorage.clear();
				} else if (text !== previousText) {
					localStorage.setItem('text', text);
					previousText = text;
				}
			};
		} else {
			periodicSave = function () {};
		}
	}());

	$(window).unload(periodicSave);
	window.setInterval(periodicSave, 1000);


	(function () {
		var prevText,
			clip = new ZeroClipboard($('#command-copy'));

		clip.on('complete', function (clip, args) {
			console.log(args);
			var text = args.text;

			if (text === $('textarea').val()) {
				$('#status').text('copy succeeded.');
				$('textarea').select();
			} else {
				$('#status').text('copy error, try again.');
			}

			window.setTimeout(function () {
				$('#status').text('');
			}, 5000);
		});

		$('textarea').change(function () {
			clip.setText($(this).val());
		});

		clip.on('mouseover', function (clip) {
			clip.setText($('textarea').val());
		});

		$(window).resize(function () {
			var $window = $(window);

			$('textarea').css({
				width: ($window.width() - 17) + 'px',
				height: ($window.height() - 120) + 'px'
			});
		}).resize();

		if (localStorage) {
			$('#autosave-status').text('autosave enabled.');

			prevText = localStorage.getItem('text');

			if (prevText !== null) {
				$('textarea').val(prevText);
			}
		} else {
			$('#autosave-status').text('autosave disabled.');
		}

		$('body').show();
		$('textarea').focus();
	}());
}());
