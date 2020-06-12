const validate = require("./validation.js");
const tasks = require("./tasks.js");

test("Validate date inputs", () => {
    expect(validate.date(new Date())).toBe(true);
    expect(() => validate.date(new Object())).toThrow();
});

test("Validate boolean inputs", () => {
    expect(validate.toggle(true)).toBe(true);
    expect(validate.toggle(false)).toBe(true);
    expect(() => validate.toggle(new Object())).toThrow();
});

test("Validate user description inputs", () => {
    expect(validate.userDescription("This is a user's desc.")).toBe(true);
    expect(() => validate.userDescription(new Object())).toThrow();
});

test("Validate task input", () => {
    const task = tasks.create();
    
    expect(validate.task(task)).toBe(true);
    expect(() => validate.task(new Object())).toThrow();
})