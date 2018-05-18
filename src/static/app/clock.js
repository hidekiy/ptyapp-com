/*
 * Copyright (c) 2012 ptyapp.com. All rights reserved.
 */

/*jslint browser: true, devel: true*/
/*global jQuery*/

(function () {
	'use strict';

	var $ = jQuery,
		PI_2 = Math.PI * 2,
		PI_05 = Math.PI * 0.5,
		canvas = $('#clock')[0],
		ctx,
		clock = {};

	function drawClockFrame() {
		var min,
			radius,
			rotate_arg = (1 / 60) * PI_2,
			radius_large = clock.size.half * 0.02,
			radius_small = clock.size.half * 0.01;

		ctx.save();
		ctx.translate(clock.center.x, clock.center.y);
		ctx.rotate(-PI_05);

		ctx.lineWidth = 0;
		ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';

		for (min = 0; min < 60; min += 1) {
			radius = (min % 5 === 0) ? radius_large : radius_small;

			ctx.beginPath();
			ctx.arc(clock.size.half, 0, radius, 0, PI_2);
			ctx.fill();

			ctx.rotate(rotate_arg);
		}

		ctx.restore();
	}

	function drawMinute() {
		var now = new Date(),
			arg = (now.getMinutes() / 60 + now.getSeconds() / 3600) * PI_2 - PI_05,
			size = 0.9;

		ctx.save();
		ctx.translate(clock.center.x, clock.center.y);
		ctx.rotate(arg);

		ctx.lineWidth = clock.size.half * 0.06;
		ctx.strokeStyle = 'rgba(0, 0, 0, 0.7)';

		ctx.beginPath();
		ctx.moveTo(0, 0);
		ctx.lineTo(clock.size.half * size, 0);
		ctx.stroke();

		ctx.restore();
	}

	function drawHour() {
		var now = new Date(),
			arg = ((now.getHours() % 12) / 12 + now.getMinutes() / 720) * PI_2 - PI_05,
			size = 0.65;

		ctx.save();
		ctx.translate(clock.center.x, clock.center.y);
		ctx.rotate(arg);

		ctx.lineWidth = clock.size.half * 0.1;
		ctx.strokeStyle = 'rgba(0, 0, 0, 0.7)';

		ctx.beginPath();
		ctx.moveTo(0, 0);
		ctx.lineTo(clock.size.half * size, 0);
		ctx.stroke();

		ctx.restore();
	}

	function refresh() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		drawClockFrame();
		drawHour();
		drawMinute();
	}

	$(window).resize(function () {
		var $window = $(window);

		$('#clock').attr({
			width: $window.width() - 10,
			height: $window.height() - 10
		});

		clock.center = {
			x: Math.floor($window.width() / 2),
			y: Math.floor($window.height() / 2)
		};
		clock.size = {
			half: Math.floor(Math.min(canvas.width, canvas.height) * 0.45)
		};
		clock.size.full = clock.size.half * 2;

		ctx = canvas.getContext('2d');
		ctx.lineCap = 'round';
		ctx.lineJoin = 'round';

		refresh();
	}).resize();

	setInterval(refresh, 1000);
}());
