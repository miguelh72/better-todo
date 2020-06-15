const users = require("./users.js");

test("Create users with default values", () => {
    const user1 = users.create();
    const user2 = users.create();
    
    expect(typeof user1.uid).toBe("number");
    expect(user1.uid).not.toBe(user2.uid);
    expect(user1.dateCreated instanceof Date).toBe(true);
    expect(user1.dateUpdated instanceof Date).toBe(true);
    expect(user1.username).toBe(null);
    expect(user1.name).toBe("Guest");
});

test("Create user with custom values", () => {
    const mike = {username: "mike72", name: "Mike Hern", date: new Date()};
    const john = {username: "johndoe", name: "John Doe", date: new Date("01/01/2019")};

    const mikeUsr = users.create(mike.username, mike.name, mike.date);
    const johnUsr = users.create(john.username, john.name, john.date);

    expect(mikeUsr.uid).not.toBe(johnUsr.uid);
    expect(mikeUsr.username).toBe(mike.username);
    expect(johnUsr.username).toBe(john.username);
    expect(mikeUsr.name).toBe(mike.name);
    expect(johnUsr.name).toBe(john.name);
    expect(mikeUsr.dateCreated).toBe(mike.date);
    expect(johnUsr.dateCreated).toBe(john.date);
    expect(mikeUsr.dateUpdated).toBe(mike.date);
    expect(johnUsr.dateUpdated).toBe(john.date);

    expect(() => users.create(new Object(), mike.name, mike.date)).toThrow();
    expect(() => users.create(mike.username, new Object, mike.date)).toThrow();
    expect(() => users.create(mike.username, mike.name, new Object)).toThrow();
});

test("Edit user attributes.", () => {
    const mike = { username: "mike72", name: "Mike Hern", date: new Date() };
    const mikeUpdated = { name: "Miguel Hernandez" };
    const mikeUsr = users.create(mike.username, mike.name, mike.date);

    mikeUsr.name = mikeUpdated.name;
    expect(mikeUsr.name).toBe(mikeUpdated.name);
    expect(() => mikeUsr.name = new Object()).toThrow();
});

test("Preventing setting permanent attributes", () => {
    const mike = {username: "mike72", name: "Mike Hern", date: new Date()};
    const mikeUsr = users.create(mike.username, mike.name, mike.date);

    expect(() => mikeUsr.uid = 3).toThrow();
    expect(() => mikeUsr.username = "johnny").toThrow();
    expect(() => mikeUsr.dateCreated = new Date()).toThrow();
});