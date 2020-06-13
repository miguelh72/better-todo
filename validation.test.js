const validate = require("./validation.js");
const tasks = require("./tasks.js");
const users = require("./users.js");

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
    expect(validate.description("This is a user's desc.")).toBe(true);
    expect(() => validate.description(new Object())).toThrow();
    expect(() => validate.description()).toThrow();

});

test("Validate user UID input", () => {
    expect(validate.uniqueID(5)).toBe(true);
    expect(() => validate.uniqueID(2.3)).toThrow();
    expect(() => validate.uniqueID("5")).toThrow();
    expect(() => validate.uniqueID(new Object())).toThrow();
    expect(() => validate.uniqueID()).toThrow();
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

// TODO create incomplete mixin combinations and test below
test("Validate task input", () => {
    const task = tasks.create();
    
    expect(validate.task(task)).toBe(true);
    expect(() => validate.task(new Object())).toThrow();
    expect(() => validate.task()).toThrow();
});

test("Validate task list input", () => {
    const taskList = tasks.createList(72, "my task list", "task list for my tasks");

    expect(validate.taskList(taskList)).toBe(true);
    expect(() => validate.taskList(new Object())).toThrow();
    expect(() => validate.taskList()).toThrow();
});

test("Validate User input", () => {
    let user = users.create();

    expect(validate.user(user)).toBe(true);
    expect(() => validate.user(new Object())).toThrow();
    expect(() => validate.user()).toThrow();
});