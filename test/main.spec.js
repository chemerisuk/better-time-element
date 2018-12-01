describe("better-time-element", function() {
    const DEFAULT_LANGUAGE = void 0;

    it("formats datetime to local by default", function() {
        const dateValue = new Date();
        const el = DOM.mock(`<local-time datetime="${dateValue.toISOString()}">`);

        expect(el.value()).toBe(dateValue.toLocaleString(DEFAULT_LANGUAGE));
    });

    it("supports data-format attribute", function() {
        const dateValue = new Date();
        const formatOptions = {"month":"short","year":"numeric","day":"numeric"};
        const el = DOM.mock(`<local-time datetime="${dateValue.toISOString()}" data-format='${JSON.stringify(formatOptions)}'>`);

        expect(el.value()).toBe(dateValue.toLocaleString(DEFAULT_LANGUAGE, formatOptions));
        expect(el.value()).not.toBe(dateValue.toLocaleString(DEFAULT_LANGUAGE));
    });

    it("respects lang attribute value", function() {
        const lang = "ru";
        const dateValue = new Date();
        const el = DOM.mock(`<local-time datetime="${dateValue.toISOString()}" lang="${lang}">`);

        expect(lang).not.toBe(DEFAULT_LANGUAGE);
        expect(el.value()).toBe(dateValue.toLocaleString(lang));
        expect(el.value()).not.toBe(dateValue.toLocaleString(DEFAULT_LANGUAGE));
    });

    it("uses default browser language if value is invalid", function() {
        const lang = "123";
        const dateValue = new Date();
        const el = DOM.mock(`<local-time datetime="${dateValue.toISOString()}" lang="${lang}">`);

        expect(lang).not.toBe(DEFAULT_LANGUAGE);
        expect(el.value()).toBe(dateValue.toLocaleString());
    });

    it("prints invalid and empty dates", function() {
        const lang = "ru";
        const invalidDateString = new Date(NaN).toString();
        const el = DOM.mock(`<local-time datetime="Bad date" lang="${lang}">`);

        expect(el.value()).toBe(invalidDateString);
    });

    it("supports global formats", function() {
        const dateValue = new Date();
        const formatOptions = {"hour":"numeric","minute":"numeric","second":"numeric"};
        const el = DOM.mock(`<local-time datetime="${dateValue.toISOString()}" data-format="timeOnly">`);

        expect(el.value()).toBe(dateValue.toLocaleString(DEFAULT_LANGUAGE, formatOptions));
        expect(el.value()).not.toBe(dateValue.toLocaleString(DEFAULT_LANGUAGE));
    });
});
