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
        el.set("data-format", "d/M/y");
        el._changeValue();
        expect(el.get("innerText")).toBe("3/2/8");

        el.set("datetime", "2007-02-08");
        el.set("data-format", "dd MM, DD yy");
        el._changeValue();
        expect(el.get("innerText")).toBe("08 02, 039 07");

        el.set("datetime", "2012-10-14");
        el.set("data-format", "d M, D y");
        el._changeValue();
        expect(el.get("innerText")).toBe("14 10, 288 12");

        el.set("datetime", "1970-01-01");
        el.set("data-format", "yyyy-MM-dd");
        el._changeValue();
        expect(el.get("innerText")).toBe("1970-01-01");
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

        date.setHours(10);
        el.set("datetime", date.toISOString());
        el.set("data-format", "h:mm p P");
        el._changeValue();
        expect(el.get("innerText")).toBe("10:20 am AM");

        date.setHours(17);
        el.set("datetime", date.toISOString());
        el.set("data-format", "h:mm p P");
        el._changeValue();
        expect(el.get("innerText")).toBe("5:20 pm PM");
    });

    it("keeps literals on custom formats", function() {
        el.set("datetime", "2014-12-03");
        el.set("data-format", "EE (u), MMMM d'th' yyyy 'etc.'");
        el._changeValue();
        expect(el.get("innerText")).toBe("Wednesday (3), December 3th 2014 etc.");

        el.set("data-format", "EE (u), MMMM d\"th\" yyyy \"etc.\"");
        el._changeValue();
        expect(el.get("innerText")).toBe("Wednesday (3), December 3th 2014 etc.");
    });

    it("watches for changes", function() {
        var date = new Date("2014-08-02T02:20Z");
        var hours = date.getHours();

        el.set("datetime", "2014-12-02T02:05:04Z");
        expect(el.get("innerText")).toBe("Tu, 02 DecDec. 2014 " + hours + ":05:04");

        el.set("data-format", "MM/dd/yyyy");
        expect(el.get("innerText")).toBe("12/02/2014");
    });

    it("prints invalid and empty dates", function() {
        var invalidDateString = new Date(NaN).toString();

        el.set("datetime", "bad date");
        el._changeValue();
        expect(el.get("innerText")).toBe(invalidDateString);

        el.set("datetime", "");
        el._changeValue();
        expect(el.get("innerText")).toBe("");
    });
});
