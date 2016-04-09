(function(DOM, DateUtils) {
    "use strict";

    var __ = DOM.__;
    var pad = (num, maxlen) => maxlen === 1 ? num : ("00" + num).slice(-maxlen);

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
    getDayInYear(d) {
        var beginOfYear = Date.UTC(d.getUTCFullYear(), 0, 1);
        var millisBetween = d.getTime() - beginOfYear;
        return Math.floor(1 + millisBetween / 86400000);
    }
}));
