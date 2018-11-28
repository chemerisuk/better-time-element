const HTML = DOM.find("html");
const DEFAULT_LANGUAGE = HTML.get("lang") || void 0;
const globalFormatters = DOM.findAll("meta[name^='data-format:']").reduce((globalFormatters, meta) => {
    const key = meta.get("name").split(":")[1].trim();
    const formatOptions = JSON.parse(meta.get("content"));
    if (key) {
        try {
            globalFormatters[key] = new window.Intl.DateTimeFormat(DEFAULT_LANGUAGE, formatOptions);
        } catch(err) {}
    }
    return globalFormatters;
}, {});

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
