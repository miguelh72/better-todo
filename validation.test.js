const validate = require("./validation.js");
const tasks = require("./tasks.js");

test("Validate date inputs", () => {
    expect(validate.date(new Date())).toBe(true);
    expect(() => validate.date(new Object())).toThrow();
    expect(() => validate.date()).toThrow();

});

test("Validate boolean inputs", () => {
    expect(validate.toggle(true)).toBe(true);
    expect(validate.toggle(false)).toBe(true);
    expect(() => validate.toggle(new Object())).toThrow();
    expect(() => validate.toggle()).toThrow();
});

test("Validate user description inputs", () => {
    expect(validate.userDescription("This is a user's desc.")).toBe(true);
    expect(() => validate.userDescription(new Object())).toThrow();
    expect(() => validate.userDescription()).toThrow();

});

test("Validate task input", () => {
    const task = tasks.create();
    
    expect(validate.task(task)).toBe(true);
    expect(() => validate.task(new Object())).toThrow();
    expect(() => validate.task()).toThrow();
})

test("Validate user UID input", () => {
    expect(validate.userID(5)).toBe(true);
    expect(() => validate.userID(2.3)).toThrow();
    expect(() => validate.userID("5")).toThrow();
    expect(() => validate.userID(new Object())).toThrow();
    expect(() => validate.userID()).toThrow();
});

test("Validate username input", () => {
    expect(validate.username("mike72hello")).toBe(true);
    expect(validate.username("mike72")).toBe(true);
    expect(validate.username("mike_hern")).toBe(true);
    expect(validate.username("mikeHern")).toBe(true);
    expect(validate.username("mikeHern72")).toBe(true);

    expect(validate.username("72mike72")).toBe(false);
    expect(validate.username("mike 72")).toBe(false);
    expect(validate.username("mike hern")).toBe(false);
    expect(validate.username("mike!")).toBe(false);
    expect(validate.username("!mike")).toBe(false);
    expect(validate.username("mike.")).toBe(false);
    expect(validate.username(".mike")).toBe(false);
    expect(validate.username("724545")).toBe(false);
    expect(validate.username("he")).toBe(false);

    expect(() => validate.username(new Object())).toThrow();
    expect(() => validate.username()).toThrow();
});

test("Validate user name input", () => {
    expect(validate.name("Miguel")).toBe(true);
    expect(validate.name("Miguel Hern")).toBe(true);
    expect(validate.name("Miguel72")).toBe(false);
    expect(validate.name("Miguel!")).toBe(false);
    expect(validate.name("!Miguel")).toBe(false);
    expect(validate.name("Miguel_Hern")).toBe(false);
    expect(validate.name("7Miguel")).toBe(false);
    expect(validate.name("Miguel Hern7")).toBe(false);
    expect(validate.name("Miguel Hern?")).toBe(false);
    expect(validate.name("Miguel.")).toBe(false);
    expect(validate.name(".Miguel Hern")).toBe(false);
    expect(() => validate.name(new Object())).toThrow();
    expect(() => validate.name()).toThrow();
});