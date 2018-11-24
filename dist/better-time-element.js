/**
 * better-time-element: Useful <time> element extensions
 * @version 2.0.0-beta.1 Sat, 24 Nov 2018 10:52:02 GMT
 * @link https://github.com/chemerisuk/better-time-element
 * @copyright 2018 Maksim Chemerisuk
 * @license MIT
 */
;

(function () {
  "use strict";

  var HTML = DOM.find("html");
  var DEFAULT_LANGUAGE = HTML.get("lang");
  var globalFormatters = {};
  var DateTimeFormat = window.Intl.DateTimeFormat;

  if (DateTimeFormat) {
    DOM.findAll("meta[name^='data-format:']").forEach(function (meta) {
      var key = meta.get("name").split(":").pop();
      var formatOptions = meta.get("content");

      try {
        globalFormatters[key] = new DateTimeFormat(DEFAULT_LANGUAGE, JSON.parse(formatOptions));
      } catch (err) {}
    });
  }

  DOM.extend("local-time", {
    constructor: function constructor() {
      var lang = this.get("lang") || DEFAULT_LANGUAGE;
      var dateValue = new Date(this.get("datetime"));
      var formatOptions = this.get("data-format");
      this.value(this._formatDate(dateValue, lang, formatOptions));
    },
    _formatDate: function _formatDate(dateValue, lang, formatOptions) {
      var formatter = globalFormatters[formatOptions];

      try {
        if (formatter && lang === DEFAULT_LANGUAGE) {
          return formatter.format(dateValue);
        } else {
          return dateValue.toLocaleString(lang, formatOptions ? JSON.parse(formatOptions) : {});
        }
      } catch (err) {
        return dateValue.toLocaleString();
      }
    }
  });
})();