describe("better-time-element", function() {
    "use strict";

    var el;

    beforeEach(function() {
        el = DOM.mock("<time is=local-time>");
    });

    it("formats date with default format", function() {
        var date = new Date("2014-08-03T02:20Z");
        var hours = date.getHours();

        el.set("datetime", "2014-08-03T02:05:04Z");

        el._changeValue();

        expect(el.get("innerText")).toBe("Su, 03 AugAug. 2014 " + hours + ":05:04");
    });

    it("formats date with custom formats", function() {
        el.set("datetime", "2014-08-03");
        el.set("data-format", "MM/dd/yyyy");
        el._changeValue();
        expect(el.get("innerText")).toBe("08/03/2014");

        el.set("datetime", "2008-02-03");
        el.set("data-format", "w: d/M/y");
        el._changeValue();
        expect(el.get("innerText")).toBe("5: 3/2/8");

        el.set("datetime", "2007-02-08");
        el.set("data-format", "dd W MM, DD ww yy");
        el._changeValue();
        expect(el.get("innerText")).toBe("08 2 02, 039 06 07");

        el.set("datetime", "2012-10-14");
        el.set("data-format", "d W M, D w y");
        el._changeValue();
        expect(el.get("innerText")).toBe("14 3 10, 288 41 12");
    });

    it("formats time with custom formats", function() {
        var date = new Date("2014-08-03T02:20Z");
        var hours = date.getHours();
        var zeroHours = ("00" + date.getHours()).slice(-2);

        el.set("datetime", date.toISOString());
        el.set("data-format", "MM/dd/yyyy H:mm");
        el._changeValue();
        expect(el.get("innerText")).toBe("08/03/2014 " + hours + ":20");

        el.set("datetime", date.toISOString());
        el.set("data-format", "MM/dd/yyyy HH:m");
        el._changeValue();
        expect(el.get("innerText")).toBe("08/03/2014 " + zeroHours + ":20");

        el.set("datetime", date.toISOString());
        el.set("data-format", "MM/dd/yyyy h:mm");
        el._changeValue();
        expect(el.get("innerText")).toBe("08/03/2014 " + (hours % 12 || 12) + ":20");
    });

    // it("keeps literals on custom formats", function() {
    //     el.set("datetime", "2014-12-03");
    //     el.set("data-format", "EE (u), F'th week of' MMMM d'th' yy (DD'th of year')");

    //     el._changeValue();

    //     expect(el.get("innerText")).toBe("Wednesday (3), 1th week of December 3th 14 (337th of year)");
    // });

    it("listens to change event", function() {
        var date = new Date("2014-08-02T02:20Z");
        var hours = date.getHours();

        el.set("datetime", "2014-12-02T02:05:04Z");
        expect(el.get("innerText")).toBe("");

        el.fire("change");

        expect(el.get("innerText")).toBe("Tu, 02 DecDec. 2014 " + hours + ":05:04");
    });

    it("prints invalid dates", function() {
        var invalidDateString = new Date(NaN).toString();

        el.set("datetime", "bad date");

        el._changeValue();

        expect(el.get("innerText")).toBe(invalidDateString);
    });
});
