const HTML = DOM.find("html");
const DEFAULT_LANGUAGE = HTML.get("lang") || "en";
const globalFormatters = {};
const DateTimeFormat = window.Intl.DateTimeFormat;

if (DateTimeFormat) {
    DOM.findAll("meta[name^='data-format:']").forEach(meta => {
        const key = meta.get("name").split(":").pop();
        const formatOptions = meta.get("content");

        try {
            globalFormatters[key] = new DateTimeFormat(DEFAULT_LANGUAGE, JSON.parse(formatOptions));
        } catch(err) {}
    });
}

DOM.extend("local-time", {
    constructor() {
        const lang = this.get("lang") || DEFAULT_LANGUAGE;
        const dateValue = new Date(this.get("datetime"));
        const formatOptions = this.get("data-format");

        this.value(this._formatDate(dateValue, lang, formatOptions));
    },
    _formatDate(dateValue, lang, formatOptions) {
        const formatter = globalFormatters[formatOptions];

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
