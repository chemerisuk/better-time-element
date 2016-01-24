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
                // use "E, dd MMM yyyy" as default value
                if (!formatString) formatString = "E, dd MMM yyyy H:mm:ss";

                var day = value.getUTCDay();
                var date = value.getUTCDate();
                var month = value.getUTCMonth();
                var year = value.getUTCFullYear();
                var hour = value.getHours();
                var hourAMPM = hour % 12 || 12;
                var minutes = value.getMinutes();
                var seconds = value.getSeconds();

                formatString = formatString
                        .replace(/'([^']+)'/g, "->$1<-")
                        .replace(/\w+/g, "{$&}")
                        .replace(/->{(.*?)}<-/g, (_, group) => group.replace(/}|{/g, ""));

                formattedValue = DOM.format(formatString, {
                    H: hour,
                    HH: pad(hour, 2),
                    h: hourAMPM,
                    hh: pad(hourAMPM, 2),
                    m: minutes,
                    mm: pad(minutes, 2),
                    s: seconds,
                    ss: pad(seconds, 2),
                    E: __(DateUtils.DAYS[day].slice(0, 2)).toHTMLString(),
                    EE: __(DateUtils.DAYS[day]).toHTMLString(),
                    d: date,
                    dd: pad(date, 2),
                    D: DateUtils.getDayInYear(value),
                    DD: pad(DateUtils.getDayInYear(value), 3),
                    w: DateUtils.getWeekInYear(value),
                    ww: pad(DateUtils.getWeekInYear(value), 2),
                    W: DateUtils.getWeekInMonth(value),
                    M: month + 1,
                    MM: pad(month + 1, 2),
                    MMM: __(DateUtils.MONTHS[month].substr(0, 3) + ".").toHTMLString(),
                    MMMM: __(DateUtils.MONTHS[month]).toHTMLString(),
                    y: year % 100,
                    yy: pad(year % 100, 2),
                    yyyy: year,
                    u: day || 7,
                    F: DateUtils.getWeekCountInMonth(value)
                });
            }

            this.value(formattedValue);
        }
    });
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
