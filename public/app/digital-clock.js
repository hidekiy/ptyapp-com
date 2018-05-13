/*
 * Copyright (c) 2012 ptyapp.com. All rights reserved.
 */

/*global window, jQuery*/

(function () {
	'use strict';

	var $ = jQuery,
		PI_2 = Math.PI * 2,
		PI_05 = Math.PI * 0.5;

	function drawSevenSegments(ctx, size, character) {
/*
左上角が原点

points:
0  5
1  4
2  3

bars:
  5
0	4
  6
1	3
  2
*/

		var slant = 8,
			points = [
				{
					x: slant,
					y: 0
				},
				{
					x: slant / 2.1,
					y: size.h / 2.1
				},
				{
					x: 0,
					y: size.h
				},
				{
					x: size.w,
					y: size.h
				},
				{
					x: size.w + slant / 2.1,
					y: size.h / 2.1
				},
				{
					x: size.w + slant,
					y: 0
				}
			],
			center = {
				x: size.w / 2,
				y: size.h / 2
			},
			bars = [
				[0, 1],
				[1, 2],
				[2, 3],
				[3, 4],
				[4, 5],
				[5, 0],
				[1, 4]
			],
			charTable = {
				'0': [1, 1, 1, 1, 1, 1, 0],
				'1': [0, 0, 0, 1, 1, 0, 0],
				'2': [0, 1, 1, 0, 1, 1, 1],
				'3': [0, 0, 1, 1, 1, 1, 1],
				'4': [1, 0, 0, 1, 1, 0, 1],
				'5': [1, 0, 1, 1, 0, 1, 1],
				'6': [1, 1, 1, 1, 0, 1, 1],
				'7': [1, 0, 0, 1, 1, 1, 0],
				'8': [1, 1, 1, 1, 1, 1, 1],
				'9': [1, 0, 1, 1, 1, 1, 1],
				'-': [0, 0, 0, 0, 0, 0, 1],
				' ': [0, 0, 0, 0, 0, 0, 0]
			},
			i,
			bar,
			beginPoint,
			endPoint;


		ctx.save();
		ctx.lineWidth = size.b;

		ctx.beginPath();
		for (i = 0; i < 7; i++) {
			if (charTable[character] && charTable[character][i]) {
				bar = bars[i];
				beginPoint = points[bar[0]];
				endPoint = points[bar[1]];

				ctx.moveTo(beginPoint.x, beginPoint.y);
				ctx.lineTo(endPoint.x, endPoint.y);
			}
		}
		ctx.stroke();

		ctx.beginPath();
		if (character === ':') {
			ctx.arc(center.x + slant * 0.75, center.y - size.h / 4, size.b / 1.4, 0, PI_2, false);
			ctx.arc(center.x + slant * 0.25, center.y + size.h / 4, size.b / 1.4, 0, PI_2, false);
		} else if (character === '.') {
			ctx.arc(points[2].x, points[2].y, size.b / 1.4, 0, PI_2, false);
		}
		ctx.fill();

		ctx.restore();
	}

	function refresh() {
		var canvas = $('#main')[0],
			ctx = canvas.getContext('2d'),
			i,
			d = new Date(),
			dateStr = [
				d.getYear() + 1900,
				('  ' + (d.getMonth() + 1)).slice(-2),
				('  ' + d.getDate()).slice(-2)
			].join('-'),
			timeStr = [
				('  ' + d.getHours()).slice(-2),
				':',
				('00' + d.getMinutes()).slice(-2),
				(d.getSeconds() % 2 ? '.' : '')
			].join(''),
			center = {
				x: canvas.width / 2 + 10,
				y: canvas.height / 2 + 10
			},
			width = canvas.width - 20,
			datePlaceWidth = width / dateStr.length * 0.6,
			dateCharWidth = datePlaceWidth * 0.8,
			timePlaceWidth = width / 6 * 0.95,
			timeCharWidth = timePlaceWidth * 0.60;

		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.lineCap = 'round';
		ctx.lineJoin = 'round';
		ctx.lineWidth = 0;
		ctx.strokeStyle = 'rgba(0, 0, 0, 0.7)';
		ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';

		for (i = 0; i < dateStr.length; i++) {
			ctx.save();
			ctx.translate(
				(center.x - datePlaceWidth * 5) + datePlaceWidth * i,
				datePlaceWidth * 0.5
			);
			drawSevenSegments(ctx, {
				w: dateCharWidth,
				h: dateCharWidth * 2.0,
				b: dateCharWidth * 0.05
			}, dateStr.charAt(i));
			ctx.restore();
		}

		for (i = 0; i < timeStr.length; i++) {
			ctx.save();
			ctx.translate(
				(center.x - timePlaceWidth * 2.7) + (timePlaceWidth * i),
				dateCharWidth * 4.5
			);
			drawSevenSegments(ctx, {
				w: timeCharWidth,
				h: timeCharWidth * 3.0,
				b: timeCharWidth * 0.10
			}, timeStr.charAt(i));
			ctx.restore();
		}
	}

	$(window).resize(function () {
		var $window = $(window);

		$('#main').attr({
			width: $window.width() - 20,
			height: $window.height() - 20
		});

		refresh();
	}).resize();

	window.setInterval(refresh, 1000);
}());
