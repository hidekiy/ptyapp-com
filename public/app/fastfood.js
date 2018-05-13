/*
 * Copyright (c) 2012 ptyapp.com. All rights reserved.
 */

/*global jQuery, window*/

(function ($) {
	'use strict';
	var YAHOO_APPID = 'KhdfDVmxg66keVChZP_fJ3LXSHS9m5Oki2wKg.400275sOGuBFsGHDD5RIFV5fU-',
		results_num = 3,
		defer = $.Deferred(),
		auto_map_width = Math.min($(window).width(), 1000),
		map_size = {width: auto_map_width, height: auto_map_width};

	if (!window.console) {
		window.console = {log: function () {}};
	}

	if (window.navigator.geolocation) {
		window.navigator.geolocation.getCurrentPosition(defer.resolve, defer.reject);
	} else {
		defer.reject({
			code: -2,
			message: '申し訳ございません。ご利用のブラウザでは位置情報取得APIがサポートされていません。'
		});
	}

	function readableDistance(meter) {
		if (meter >= 1000) {
			return (meter / 1000).toFixed(1) + 'km';
		} else {
			return meter.toFixed(0) + 'm';
		}
	}

	function getDistance(p1, p2) {
		var latlng1 = p1.split(','),
			latlng2 = p2.split(',');

		return readableDistance(Math.sqrt(
			Math.pow(Math.abs(latlng1[0] - latlng2[0]), 2)
				+ Math.pow(Math.abs(latlng1[1] - latlng2[1]), 2)
		) * 1e5);
	}

	function getArg(p1, p2) {
		var latlng1 = p1.split(','),
			latlng2 = p2.split(','),
			table = ['北', '北東', '東', '南東', '南', '南西', '西', '北西'];

		return table[(Math.round(
			-Math.atan2(
				latlng2[0] - latlng1[0],
				latlng2[1] - latlng1[1]
			) / Math.PI * 4
		) + 10) % 8];
	}

	defer.done(function (loc) {
		$.get('http://search.olp.yahooapis.jp/OpenLocalPlatform/V1/localSearch', {
			lat: loc.coords.latitude,
			lon: loc.coords.longitude,
			sort: 'dist',
			detail: 'full',
			results: results_num,
			cid: 'd115e2a62c8f28cb03a493dc407fa03f',
			appid: YAHOO_APPID,
			output: 'json'
		}, function (data) {
			console.log(data);

			$('#result').append(
				$('<p />', {text: [
					'現在位置の誤差: ', readableDistance(loc.coords.accuracy), '以下'
				].join('')})
			);

			$('#debug').append(
				$('<p />', {text: [
					'auto_map_width: ' + auto_map_width,
					'devicePixelRatio: ' + window.devicePixelRatio
				].join(', ')})
			);

			$.each(data.Feature, function (i) {
				var place = this,
					start_p = [loc.coords.latitude, loc.coords.longitude].join(),
					goal_p = place.Geometry.Coordinates.split(',').reverse().join(),
					goal_label = place.Name;

				$('<p />', {'class': 'map'}).append(
					[
						'第', i + 1, '候補: ',
						goal_label,
						', ',
						getArg(start_p, goal_p), getDistance(start_p, goal_p),
						', ',
						place.Property.Address,
						', '
					].join(''),
					$('<a />', {text: place.Property.Tel1, href: 'tel:' + place.Property.Tel1}),
					$('<br />'),
					[
						(place.Property.Detail.CapacityExclusively > 0 ?
								place.Property.Detail.CapacityExclusively + '席 ' : ''),

						place.Property.Detail.BreakfastMac,
						' '
					].join(''),
					$('<a />', {text: '店舗詳細', href: place.Property.Detail.PcUrl1}),
					$('<br />'),
					$('<img />', {
						src: 'http://routemap.olp.yahooapis.jp/OpenLocalPlatform/V1/routeMap?' + $.param({
							route: [start_p, goal_p].join(),
							text: [goal_p, 'label:' + goal_label].join('|'),
							appid: YAHOO_APPID,
							width: map_size.width,
							height: map_size.height
						}),
						width: map_size.width,
						height: map_size.height
					})
				).appendTo('#result');
			});

			$('#loading').hide();
		}, 'jsonp');
	}).fail(function (err) {
		var msg;

		if (err.code === err.UNKNOWN_ERROR) {
			msg = '未知のエラー';
		} else if (err.code === err.PERMISSION_DENIED) {
			msg = '位置情報取得が許可されませんでした';
		} else if (err.code === err.POSITION_UNAVAILABLE) {
			msg = '位置情報取得がサポートされていません';
		} else if (err.code === err.TIMEOUT) {
			msg = '位置情報取得が取得できません(タイムアウト)';
		}

		$('<p />', {text: [
			'申し訳ございません。位置情報取得に失敗しました',
			msg,
			err.message
		].join(': ')}).appendTo('#result');

		$('#loading').hide();
	});
}(jQuery));
