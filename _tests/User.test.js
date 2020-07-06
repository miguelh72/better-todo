"use strict";

const { User } = require("../data_models");

const mike = {username: "mike72", name: "Mike Hern", date: new Date()};
const john = {username: "johndoe", name: "John Doe", date: new Date("01/01/2019")};

test("Create users with default values", () => {
    const user1 = new User(mike.username);
    const user2 = new User(john.username);
    
    expect(user1.uid).toBe(mike.username);
    expect(user1.uid).not.toBe(user2.uid);
    expect(user1.dateCreated instanceof Date).toBe(true);
    expect(user1.dateUpdated instanceof Date).toBe(true);
    expect(user1.username).toBe(mike.username);
    expect(user1.name).toBe("Guest");
});

test("Create user with custom values", () => {
    const mikeUsr = new User(mike.username, mike.name, mike.date);
    const johnUsr = new User(john.username, john.name, john.date);

    expect(mikeUsr.uid).not.toBe(johnUsr.uid);
    expect(mikeUsr.username).toBe(mike.username);
    expect(johnUsr.username).toBe(john.username);
    expect(mikeUsr.name).toBe(mike.name);
    expect(johnUsr.name).toBe(john.name);
    expect(mikeUsr.dateCreated).toBe(mike.date);
    expect(johnUsr.dateCreated).toBe(john.date);
    expect(mikeUsr.dateUpdated).toBe(mike.date);
    expect(johnUsr.dateUpdated).toBe(john.date);
});

test("Create user with invalid parameter", () => {
    expect(() => new User(new Object(), mike.name, mike.date)).toThrow(/Invalid Parameter/);
    expect(() => new User(mike.username, new Object, mike.date)).toThrow(/Invalid Parameter/);
    expect(() => new User(mike.username, mike.name, new Object)).toThrow(/Invalid Parameter/);
});

test("Edit user attributes.", () => {
    const mikeUpdated = { name: "Miguel Hernandez" };

    const mikeUsr = new User(mike.username, mike.name, mike.date);

    mikeUsr.name = mikeUpdated.name;
    expect(mikeUsr.name).toBe(mikeUpdated.name);
    expect(() => mikeUsr.name = new Object()).toThrow(/Invalid Parameter/);
});

test("Preventing setting permanent attributes", () => {
    const mike = {username: "mike72", name: "Mike Hern", date: new Date()};
    const mikeUsr = new User(mike.username, mike.name, mike.date);

    expect(() => mikeUsr.uid = 3).toThrow(/Assignment Error/);
    expect(() => mikeUsr.username = "johnny").toThrow(/Assignment Error/);
    expect(() => mikeUsr.dateCreated = new Date()).toThrow(/Assignment Error/);
});