"use strict";

const controller = require("./app_controller.js");
const validate = require("./validation.js");

test("Create a new user.", async () => {
    const userInfo = {
        name: "Mike",
        username: "mike72",
        dateCreated: new Date()
    };

    const user = await controller.asyncNewUser(userInfo.username, userInfo.name, userInfo.dateCreated);

    expect(validate.user(user)).toBe(true);
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
})

test("Create user with existing username", async () => {
    const userInfo = {
        name: "Mike",
        username: "mike72",
        dateCreated: new Date()
    };

    await controller.asyncNewUser(userInfo.username, userInfo.name, userInfo.dateCreated);

    //await expect(controller.asyncNewUser(userInfo.username, userInfo.name, userInfo.dateCreated))
    //    .rejects.toThrow(/Existing Username/);
});

// TODO Create many users simultaneously with .all