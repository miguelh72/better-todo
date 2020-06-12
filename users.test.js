const users = require("./users.js");

test("Create users with default values", () => {
    const user1 = users.create();
    const user2 = users.create();
    
    expect(typeof user1.id).toBe("number");
    expect(user1.id).not.toBe(user2.id);
    
    expect(user1.dateCreated instanceof Date).toBe(true);
    
    expect(user1.username).toBe(null);
    
    expect(user1.name).toBe("Guest");
    
    
    expect(user1.getTaskLists()).toBe() // TODO
});