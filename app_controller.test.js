"use strict";

// TODO add login system layer

const controller = require("./app_controller.js");
const validate = require("./validation.js");
const persistence = require("./persistence.js");

async function cleanupUserPersistence() {
    for (let user of (await persistence.asyncGetAllUsers()))
        await persistence.asyncRemoveUser(user.uid);
    await Promise.all(
        (await persistence.asyncGetAllUsers())
            .map(user => persistence.asyncRemoveUser(user.uid))
    );
}
cleanupUserPersistence();

/** New Users */

test("Create a new user.", async () => {
    const userInfo = {
        name: "Mike",
        username: "mike72",
        dateCreated: new Date()
    };

    const user = await controller.asyncNewUser(userInfo.username, userInfo.name, userInfo.dateCreated);

    expect(validate.user(user)).toBe(true);
    expect(user.uid).toBe(userInfo.username);
    expect(user.name).toBe(userInfo.name);
    expect(user.dateCreated).toBe(userInfo.dateCreated);

    await cleanupUserPersistence();
});

test("Try to create a bad user.", async () => {
    const userInfo = {
        name: "Mike",
        username: "mike72",
        dateCreated: new Date()
    };

    await expect(controller.asyncNewUser("73mike", userInfo.name, userInfo.dateCreated))
        .rejects.toThrow(/Invalid Format/);
    await expect(controller.asyncNewUser(userInfo.username, "mike73 Hernan", userInfo.dateCreated))
        .rejects.toThrow(/Invalid Format/);
    await expect(controller.asyncNewUser(userInfo.username, userInfo.name, new Object()))
        .rejects.toThrow(/Invalid Parameter/);

    await cleanupUserPersistence();
})

test("Create user with existing username", async () => {
    const userInfo = {
        name: "Mike",
        username: "mike72",
        dateCreated: new Date()
    };

    const user = await controller.asyncNewUser(userInfo.username, userInfo.name, userInfo.dateCreated);

    await expect(controller.asyncNewUser(userInfo.username, userInfo.name, userInfo.dateCreated))
        .rejects.toThrow(/Existing Username/);

    await cleanupUserPersistence();
});

test("Create many users simultaneously", async () => {
    const numUsers = 100;

    const userArray = await Promise.all([...Array(numUsers).keys()].map(i => controller.asyncNewUser("username" + i)));
    userArray.forEach(user => expect(validate.user(user)).toBe(true));

    await cleanupUserPersistence();
});

/** Get User */

test("Retrieve existing user", async () => {
    const userInfo = {
        name: "Mike",
        username: "mike72",
        dateCreated: new Date()
    };

    await controller.asyncNewUser(userInfo.username, userInfo.name, userInfo.dateCreated);

    const retrievedUser = await controller.asyncRetrieveUser(userInfo.username);
    expect(validate.user(retrievedUser)).toBe(true);
    expect(retrievedUser.uid).toBe(userInfo.username);
    expect(retrievedUser.name).toBe(userInfo.name);
    expect(retrievedUser.dateCreated).toBe(userInfo.dateCreated);
})

