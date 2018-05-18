/*global window, jQuery*/

(function (window, $) {
    var $window = $(window),
        $document = $(window.document),
        eyeTrack = {},
        trackTarget = [],
        prevState, done;

    function getViewRatio(win, item) {
        var view = {
            top: Math.max(win.top, item.top),
            bottom: Math.min(win.bottom, item.bottom)
        };

        var ratio = (view.bottom - view.top) / (item.bottom - item.top);
        if (ratio < 0) { ratio = 0; }

        return ratio;
    }

    function findEyeTarget(win) {
        var list = [],
            i;

        for (i = 0; trackTarget[i]; i++) {
            list[i] = {
                body: trackTarget[i],
                ratio: getViewRatio(win, trackTarget[i].offset)
            };
        }

        list.sort(function (a, b) {
            return b.ratio - a.ratio;
        });

        if (list[0].ratio === 0) {
            return null;
        }

        return list[0].body;
    }

    function dumpResult() {
        var list = trackTarget.concat(),
            submitData = [],
            $res = $('<ol />');

        list.sort(function (a, b) {
            return b.dur - a.dur;
        });

        $.each(list, function () {
            var item = this;
            var $img = item.$elem.clone();
            delete item.$elem;

            $img.attr('width', 70);

            $('<li />')
                .append($img)
                .append(' ' + item.dur + 'ms')
                .appendTo($res);

            submitData.push({
                url: item.url,
                dur: item.dur
            });
        });

        $.post('/node/eyetrack-cosplaygirl', {d: JSON.stringify(submitData)});
        $res.appendTo('body');
    }

    function refreshOffset() {
        $('.eyetrack').each(function (i) {
            var $this = $(this),
                offset = $this.offset();

            if (!trackTarget[i]) {
                trackTarget[i] = {
                    $elem: $this,
                    url: $this.attr('src'),
                    dur: 0
                };
            }

            trackTarget[i].offset = {
                top: offset.top,
                bottom: offset.top + $this.height()
            };
        });
    }

    function refreshEye() {
        var scrollTop = $window.scrollTop(),
            win = {
                top: scrollTop,
                bottom: scrollTop + $window.height()
            };

        var eye = findEyeTarget(win);

        if (eye !== null) {
            if (prevState
                && prevState.eye !== null
                && eye === prevState.eye) {

                eye.dur += (+new Date()) - prevState.time;
            }
        }

        if (!done && $document.height() - win.bottom < 50) {
            dumpResult();
            done = true;
        }

        prevState = {
            eye: eye,
            time: +new Date()
        };
    }

    eyeTrack.init = function () {
        $window.scroll(refreshEye);
        window.setInterval(refreshOffset, 1000);

        refreshOffset();
        $window.scroll();
        $window.scrollTop(0);
    };

    window.eyeTrack = eyeTrack;
}(window, jQuery));
