const users = require("./users.js");

test("Create users with default values", () => {
    const user1 = users.create();
    const user2 = users.create();
    
    expect(typeof user1.id).toBe("number");
    expect(user1.id).not.toBe(user2.id);
    expect(user1.dateCreated instanceof Date).toBe(true);
    expect(user1.username).toBe(null);
    expect(user1.name).toBe("Guest");
});

test("Create user with custom values", () => {
    const mike = {id: 1, username: "mike72", name: "Mike Hern", date: new Date()};
    const john = {id: 2, username: "johndoe", name: "John Doe", date: new Date("01/01/2019")};

    const mikeUsr = users.create(mike.id, mike.username, mike.name, mike.date);
    const johnUsr = users.create(john.id, john.username, john.name, john.date);

    expect(mikeUsr.id).not.toBe(johnUsr.id);
    expect(mikeUsr.username).toBe(mike.username);
    expect(johnUsr.username).toBe(john.username);
    expect(mikeUsr.name).toBe(mike.name);
    expect(johnUsr.name).toBe(john.name);
    expect(mikeUsr.dateCreated).toBe(mike.date);
    expect(johnUsr.dateCreated).toBe(john.date);

    expect(() => users.create(new Object(), mike.name, mike.date)).toThrow();
    expect(() => users.create(mike.username, new Object, mike.date)).toThrow();
    expect(() => users.create(mike.username, mike.name, new Object)).toThrow();
});

// test preventing setting permanent attributes