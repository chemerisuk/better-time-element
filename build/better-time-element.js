;

(function () {
  "use strict";

  var HTML = DOM.find("html");
  var DEFAULT_LANGUAGE = HTML.get("lang") || void 0;
  var globalFormatters = DOM.findAll("meta[name^='data-format:']").reduce(function (globalFormatters, meta) {
    var key = meta.get("name").split(":")[1].trim();
    var formatOptions = JSON.parse(meta.get("content"));

    if (key) {
      try {
        globalFormatters[key] = new window.Intl.DateTimeFormat(DEFAULT_LANGUAGE, formatOptions);
      } catch (err) {}
    }

    return globalFormatters;
  }, {});
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