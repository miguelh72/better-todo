const validate = require("./validation.js");
const persistence = require("./persistence.js");
const mixins = require("./mixins.js");
const { User } = require("./data_models");

const tasks = require("./tasks.js");

test("Validate date inputs", () => {
    expect(validate.date(new Date())).toBe(true);
    expect(() => validate.date(new Object())).toThrow(/Invalid Parameter/);
    expect(() => validate.date()).toThrow(/Invalid Parameter/);

});

test("Validate boolean inputs", () => {
    expect(validate.toggle(true)).toBe(true);
    expect(validate.toggle(false)).toBe(true);
    expect(() => validate.toggle(new Object())).toThrow(/Invalid Parameter/);
    expect(() => validate.toggle()).toThrow(/Invalid Parameter/);
});

test("Validate user description inputs", () => {
    expect(validate.description("This is a user's desc.")).toBe(true);
    expect(() => validate.description(new Object())).toThrow(/Invalid Parameter/);
    expect(() => validate.description()).toThrow(/Invalid Parameter/);

});

test("Validate user UID input", () => {
    expect(validate.uniqueID(5)).toBe(true);
    expect(() => validate.uniqueID(2.3)).toThrow();
    expect(() => validate.uniqueID("5")).toThrow();
    expect(() => validate.uniqueID(new Object())).toThrow(/Invalid Parameter/);
    expect(() => validate.uniqueID()).toThrow(/Invalid Parameter/);
});

test("Validate username input", () => {
    expect(validate.username("mike72hello")).toBe(true);
    expect(validate.username("mike72")).toBe(true);
    expect(validate.username("mike_hern")).toBe(true);
    expect(validate.username("mikeHern")).toBe(true);
    expect(validate.username("mikeHern72")).toBe(true);

    expect(() => validate.username("72mike72")).toThrow(/Invalid Format/);
    expect(() => validate.username("mike 72")).toThrow(/Invalid Format/);
    expect(() => validate.username("mike hern")).toThrow(/Invalid Format/);
    expect(() => validate.username("mike!")).toThrow(/Invalid Format/);
    expect(() => validate.username("!mike")).toThrow(/Invalid Format/);
    expect(() => validate.username("mike.")).toThrow(/Invalid Format/);
    expect(() => validate.username(".mike")).toThrow(/Invalid Format/);
    expect(() => validate.username("724545")).toThrow(/Invalid Format/);
    expect(() => validate.username("he")).toThrow(/Invalid Format/);

    expect(() => validate.username(new Object())).toThrow(/Invalid Parameter/);
    expect(() => validate.username()).toThrow(/Invalid Parameter/);
});

test("Validate user name input", () => {
    expect(validate.name("Miguel")).toBe(true);
    expect(validate.name("Miguel Hern")).toBe(true);

    expect(() => validate.name("Miguel72")).toThrow(/Invalid Format/);
    expect(() => validate.name("Miguel!")).toThrow(/Invalid Format/);
    expect(() => validate.name("!Miguel")).toThrow(/Invalid Format/);
    expect(() => validate.name("Miguel_Hern")).toThrow(/Invalid Format/);
    expect(() => validate.name("7Miguel")).toThrow(/Invalid Format/);
    expect(() => validate.name("Miguel Hern7")).toThrow(/Invalid Format/);
    expect(() => validate.name("Miguel Hern?")).toThrow(/Invalid Format/);
    expect(() => validate.name("Miguel.")).toThrow(/Invalid Format/);
    expect(() => validate.name(".Miguel Hern")).toThrow(/Invalid Format/);

    expect(() => validate.name(new Object())).toThrow(/Invalid Parameter/);
    expect(() => validate.name()).toThrow(/Invalid Parameter/);
});

test("Validate task input", () => {
    const task = tasks.create();

    expect(validate.task(task)).toBe(true);
    expect(() => validate.task(new Object())).toThrow(/Invalid Parameter/);
    expect(() => validate.task()).toThrow(/Invalid Parameter/);

    let AlmostTask = class extends mixins.mix(
        Object,
        mixins.Updatable,
        mixins.Description,
        mixins.Importance,
        mixins.Urgency,
        mixins.Archivable,
    ) { }
    expect(() => validate.task(new AlmostTask())).toThrow(/Invalid Parameter/);

    AlmostTask = class extends mixins.mix(
        Object,
        mixins.Creatable,
        mixins.Updatable,
        mixins.Description,
        mixins.Importance,
        mixins.Archivable,
    ) { }
    expect(() => validate.task(new AlmostTask())).toThrow(/Invalid Parameter/);
});

test("Validate task list input", () => {
    const taskList = tasks.createList(72, "my task list", "task list for my tasks");

    expect(validate.taskList(taskList)).toBe(true);
    expect(() => validate.taskList(new Object())).toThrow(/Invalid Parameter/);
    expect(() => validate.taskList()).toThrow(/Invalid Parameter/);

    let AlmostTaskList = class extends mixins.mix(
        Object,
        mixins.UniqueID,
        mixins.Description,
        mixins.Nameable,
        mixins.Archivable,
    ) { }
    expect(() => validate.taskList(new AlmostTaskList())).toThrow(/Invalid Parameter/);
});

test("Validate User input", () => {
    let user = new User("mike72");

    expect(validate.user(user)).toBe(true);
    expect(() => validate.user(new Object())).toThrow(/Invalid Parameter/);
    expect(() => validate.user()).toThrow(/Invalid Parameter/);

    let AlmostUser = class extends mixins.mix(
        Object,
        mixins.UniqueID,
        mixins.Account,
        mixins.Creatable,
        mixins.Nameable,
    ) { }
    expect(() => validate.user(new AlmostUser())).toThrow(/Invalid Parameter/);

    AlmostUser = class extends mixins.mix(
        Object,
        mixins.UniqueID,
        mixins.Creatable,
        mixins.Nameable,
        mixins.Updatable,
    ) { }
    expect(() => validate.user(new AlmostUser())).toThrow(/Invalid Parameter/);
});

test("Validate list table input", () => {
    const user = new User("mike72");
    const taskLists = [tasks.createList(1)];
    const listTable = persistence.createListTable(user, taskLists);

    expect(validate.listTable(listTable)).toBe(true);
    expect(() => validate.listTable(new Object())).toThrow(/Invalid Parameter/);
    expect(() => validate.listTable()).toThrow(/Invalid Parameter/);

    let AlmostListTable = class extends mixins.mix(
        Object,
        mixins.UniqueID,
    ) { }
    expect(() => validate.listTable(new AlmostListTable())).toThrow(/Invalid Parameter/);
});
