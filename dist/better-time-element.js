/**
 * better-time-element: Useful <time> element extensions
 * @version 1.0.0-beta.3 Wed, 06 Apr 2016 16:52:58 GMT
 * @link https://github.com/chemerisuk/better-time-element
 * @copyright 2016 Maksim Chemerisuk
 * @license MIT
 */
(function (DOM, DateUtils) {
    "use strict";

    var __ = DOM.__;
    var pad = function (num, maxlen) {
        return maxlen === 1 ? num : ("00" + num).slice(-maxlen);
    };

    DOM.extend("time[is=local-time]", {
        constructor: function () {
            this.on("change", this._changeValue.bind(this));

            this._changeValue();
        },
        _changeValue: function () {
            var datetimeText = this.get("datetime");

            if (!datetimeText) return;

            var value = new Date(datetimeText),
                formattedValue = "";

            if (!value.getTime()) {
                formattedValue = value.toString();
            } else {
                var formatString = this.get("data-format");
                // use "E, dd MMM yyyy H:mm:ss" as default value
                if (!formatString) formatString = "E, dd MMM yyyy H:mm:ss";

                formattedValue = formatString.replace(/\w+/g, function (str) {
                    switch (str) {
                        case "H":
                        case "HH":
                            str = pad(value.getHours(), str.length);
                            break;

                        case "h":
                        case "hh":
                            str = pad(value.getHours() % 12 || 12, str.length);
                            break;

                        case "m":
                        case "mm":
                            str = pad(value.getMinutes(), str.length);
                            break;

                        case "s":
                        case "ss":
                            str = pad(value.getSeconds(), str.length);
                            break;

                        case "d":
                        case "dd":
                            str = pad(value.getDate(), str.length);
                            break;

                        case "E":
                            str = __(DateUtils.DAYS[value.getDay()].slice(0, 2));
                            break;

                        case "EE":
                            str = __(DateUtils.DAYS[value.getDay()]);
                            break;

                        case "D":
                        case "DD":
                            str = pad(DateUtils.getDayInYear(value), str.length === 1 ? 1 : 3);
                            break;

                        case "w":
                        case "ww":
                            str = pad(DateUtils.getWeekInYear(value), str.length);
                            break;

                        case "W":
                            str = DateUtils.getWeekInMonth(value);
                            break;

                        case "M":
                        case "MM":
                            str = pad(value.getMonth() + 1, str.length);
                            break;

                        case "MMM":
                            str = __(DateUtils.MONTHS[value.getMonth()].substr(0, 3) + ".");
                            break;

                        case "MMMM":
                            str = __(DateUtils.MONTHS[value.getMonth()]);
                            break;

                        case "y":
                        case "yy":
                            str = pad(value.getFullYear() % 100, str.length);
                            break;

                        case "yyyy":
                            str = value.getFullYear();
                            break;

                        case "u":
                            str = value.getDay() || 7;
                            break;

                        case "F":
                            str = DateUtils.getWeekCountInMonth(value);
                            break;
                    }

                    return str.toString();
                });
            }

            this.value(formattedValue);
        }
    });

    // compact months in english don't have the dot suffix
    DOM.importStrings("en", DateUtils.MONTHS.reduce(function (memo, month) {
        var shortMonth = month.slice(0, 3);

        memo[shortMonth + "."] = shortMonth;

        return memo;
    }, {}));
})(window.DOM, {
    DAYS: "Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "),
    MONTHS: "January February March April May June July August September October November December".split(" "),
    getWeekInYear: function (d) {
        d = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
        // set to nearest thursday: current date + 4 - current day number
        // make sunday's day number 7
        d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
        var yearStart = Date.UTC(d.getUTCFullYear(), 0, 1);
        // calculate full weeks to nearest thursday
        return Math.ceil((1 + (d - yearStart) / 86400000) / 7);
    },
    getWeekInMonth: function (d) {
        var firstWeekday = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1)).getUTCDay();
        var offsetDate = d.getUTCDate() + firstWeekday - 1;
        return 1 + Math.floor(offsetDate / 7);
    },
    getWeekCountInMonth: function (d) {
        return Math.ceil(d.getUTCDate() / 7);
    },
    getDayInYear: function (d) {
        var beginOfYear = Date.UTC(d.getUTCFullYear(), 0, 1);
        var millisBetween = d.getTime() - beginOfYear;
        return Math.floor(1 + millisBetween / 86400000);
    }
});