const HTML = DOM.find("html");

DOM.extend("local-time", {
    constructor() {
        const lang = this.get("lang") || HTML.get("lang");
        const dateValue = new Date(this.get("datetime"));
        const formatOptions = this.get("data-format");

        this.value(this._formatDate(dateValue, lang, formatOptions));
    },
    _formatDate(dateValue, lang, formatOptions) {
        try {
            return dateValue.toLocaleString(lang, formatOptions ? JSON.parse(formatOptions) : {});
        } catch (err) {
            return dateValue.toLocaleString();
        }
    }
});
