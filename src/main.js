(function(DOM, DateUtils) {
    "use strict";

    var __ = DOM.__;
    var pad = (num, maxlen) => ("00" + num).slice(-maxlen);

    DOM.extend("time[is=local-time]", {
        constructor() {
            this.on("change", this._changeValue.bind(this));

            this._changeValue();
        },
        _changeValue() {
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

                formattedValue = formatString.replace(/\w+/g, (str) => {
                    switch (str) {
                        case "H": str = value.getHours(); break;
                        case "HH": str = pad(value.getHours(), 2); break;
                        case "h": str = value.getHours() % 12 || 12; break;
                        case "hh": str = pad(value.getHours() % 12 || 12, 2); break;
                        case "m": str = value.getMinutes(); break;
                        case "mm": str = pad(value.getMinutes(), 2); break;
                        case "s": str = value.getSeconds(); break;
                        case "ss": str = pad(value.getSeconds(), 2); break;
                        case "E": str = __(DateUtils.DAYS[value.getUTCDay()].slice(0, 2)); break;
                        case "EE": str = __(DateUtils.DAYS[value.getUTCDay()]); break;
                        case "d": str = value.getDate(); break;
                        case "dd": str = pad(value.getDate(), 2); break;
                        case "D": str = DateUtils.getDayInYear(value); break;
                        case "DD": str = pad(DateUtils.getDayInYear(value), 3); break;
                        case "w": str = DateUtils.getWeekInYear(value); break;
                        case "ww": str = pad(DateUtils.getWeekInYear(value), 2); break;
                        case "W": str = DateUtils.getWeekInMonth(value); break;
                        case "M": str = value.getMonth() + 1; break;
                        case "MM": str = pad(value.getMonth() + 1, 2); break;
                        case "MMM": str = __(DateUtils.MONTHS[value.getMonth()].substr(0, 3) + "."); break;
                        case "MMMM": str = __(DateUtils.MONTHS[value.getMonth()]); break;
                        case "y": str = value.getFullYear() % 100; break;
                        case "yy": str = pad(value.getFullYear() % 100, 2); break;
                        case "yyyy": str = value.getFullYear(); break;
                        case "u": str = value.getDay() || 7; break;
                        case "F": str = DateUtils.getWeekCountInMonth(value); break;
                    }

                    return str.toString();
                });
            }

            this.value(formattedValue);
        }
    });

    // compact months in english don't have the dot suffix
    DOM.importStrings("en", DateUtils.MONTHS.reduce((memo, month) => {
        var shortMonth = month.slice(0, 3);

        memo[shortMonth + "."] = shortMonth;

        return memo;
    }, {}));
}(window.DOM, {
    DAYS: "Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "),
    MONTHS: "January February March April May June July August September October November December".split(" "),
    getWeekInYear(d) {
        d = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
        // set to nearest thursday: current date + 4 - current day number
        // make sunday's day number 7
        d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
        var yearStart = Date.UTC(d.getUTCFullYear(), 0, 1);
        // calculate full weeks to nearest thursday
        return Math.ceil((1 + (d - yearStart) / 86400000) / 7);
    },
    getWeekInMonth(d) {
        var firstWeekday = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1)).getUTCDay();
        var offsetDate = d.getUTCDate() + firstWeekday - 1;
        return 1 + Math.floor(offsetDate / 7);
    },
    getWeekCountInMonth(d) {
        return Math.ceil(d.getUTCDate() / 7);
    },
    getDayInYear(d) {
        var beginOfYear = Date.UTC(d.getUTCFullYear(), 0, 1);
        var millisBetween = d.getTime() - beginOfYear;
        return Math.floor(1 + millisBetween / 86400000);
    }
}));
