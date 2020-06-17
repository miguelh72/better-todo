"use strict";

// TODO add login system layer

const controller = require("./app_controller.js");
const validate = require("./validation.js");
const persistence = require("./persistence.js");
const users = require("./users.js");

async function cleanupPersistence() {
    await Promise.all(
        (await persistence.asyncReadAllUsers())
            .map(user => persistence.asyncDeleteUser(user.uid))
    );
    await Promise.all(
        (await persistence.asyncReadAllTaskList())
            .map(taskList => persistence.asyncDeleteTaskList(taskList.uid))
    );
    await Promise.all(
        (await persistence.asyncReadAllListTable())
            .map(listTable => persistence.asyncDeleteListTable(listTable.uid))
    );
}

const testUserInfo = {
    name: "Mike",
    username: "mike72",
    dateCreated: new Date("02/19/2005"),
};

/** Create User */

async function testUserCreation(user) {
    expect(validate.user(user)).toBe(true);
    
    const userListTable = await persistence.asyncReadListTable(user.uid);
    expect(validate.listTable(userListTable)).toBe(true);

    const defaultTaskListID = userListTable.getListIDs()[0];
    expect(validate.uniqueID(defaultTaskListID)).toBe(true);
    const defaultTaskList = await persistence.asyncReadTaskList(defaultTaskListID);
    expect(validate.taskList(defaultTaskList)).toBe(true);
    expect(defaultTaskList.name).toBe("default");
}

test("Create a new user.", async () => {
    const user = await controller.asyncNewUser(testUserInfo.username, testUserInfo.name, testUserInfo.dateCreated);

    await testUserCreation(user);
    expect(user.uid).toBe(testUserInfo.username);
    expect(user.name).toBe(testUserInfo.name);
    expect(user.dateCreated).toBe(testUserInfo.dateCreated);

    await cleanupPersistence();
});

test("Try to create a bad user.", async () => {
    await expect(controller.asyncNewUser("73mike", testUserInfo.name, testUserInfo.dateCreated))
        .rejects.toThrow(/Invalid Format/);
    await expect(controller.asyncNewUser(testUserInfo.username, "mike73 Hernan", testUserInfo.dateCreated))
        .rejects.toThrow(/Invalid Format/);
    await expect(controller.asyncNewUser(testUserInfo.username, testUserInfo.name, new Object()))
        .rejects.toThrow(/Invalid Parameter/);

    await cleanupPersistence();
})

test("Create user with existing username", async () => {
    const user = await controller.asyncNewUser(testUserInfo.username, testUserInfo.name, testUserInfo.dateCreated);

    await expect(controller.asyncNewUser(testUserInfo.username, testUserInfo.name, testUserInfo.dateCreated))
        .rejects.toThrow(/Existing Resource/);

    await cleanupPersistence();
});

test("Create many users simultaneously", async () => {
    const numUsers = 100;

    const userArray = await Promise.all(
        [...Array(numUsers).keys()].map(num => controller.asyncNewUser("username" + num))
    );

    for (let user of userArray) {
        await testUserCreation(user);
    }

    await cleanupPersistence();
});

/** Read User */

test("Retrieve existing user", async () => {
    await controller.asyncNewUser(testUserInfo.username, testUserInfo.name, testUserInfo.dateCreated);

    const retrievedUser = await controller.asyncRetrieveUser(testUserInfo.username);
    expect(validate.user(retrievedUser)).toBe(true);
    expect(retrievedUser.uid).toBe(testUserInfo.username);
    expect(retrievedUser.name).toBe(testUserInfo.name);
    expect(retrievedUser.dateCreated).toBe(testUserInfo.dateCreated);

    await cleanupPersistence();
})

test("Try to retrieve user not in persistence.", async () => {
    await expect(controller.asyncRetrieveUser(testUserInfo.username)).resolves.toBe(false);

    await cleanupPersistence();
});

/** Update User */

test("Update User name", async () => {
    const newName = "Miguel";

    const user = await controller.asyncNewUser(testUserInfo.username, testUserInfo.name, testUserInfo.dateCreated);
    user.name = newName;

    await expect(controller.asyncUpdateUser(user)).resolves.toBe(true);

    const retrievedUser = await controller.asyncRetrieveUser(user.username);
    expect(retrievedUser).toEqual(user);

    await cleanupPersistence();
})

test("Try to update User that does not exist", async () => {
    const user = users.create(testUserInfo.username, testUserInfo.name, testUserInfo.dateCreated);

    await expect(controller.asyncUpdateUser(user)).rejects.toThrow(/Missing Resource/);

    await cleanupPersistence();
});

/** Delete User */

test("Delete User from storage", async () => {
    const user = await controller.asyncNewUser(testUserInfo.username, testUserInfo.name, testUserInfo.dateCreated);
    const userListTable = await persistence.asyncReadListTable(user.uid);
    const defaultTaskList = await persistence.asyncReadTaskList(userListTable.getListIDs()[0]);

    await expect(controller.asyncDeleteUser(user)).resolves.toBe(true);
    await expect(persistence.asyncReadListTable(user.uid)).rejects.toThrow(/Missing Resource/);
    await expect(persistence.asyncReadTaskList(defaultTaskList.uid)).rejects.toThrow(/Missing Resource/);

    await cleanupPersistence();
});

test("Try to delete user that does not exist in storage.", async () => {
    const userNotStored = users.create(testUserInfo.username, testUserInfo.name, testUserInfo.dateCreated);

    await expect(controller.asyncDeleteUser(userNotStored)).resolves.toBe(false);
});

