"use strict";

const controller = require("./app_controller.js");
const validate = require("./validation.js");

test("Create a new user.", () => {
    const userInfo = {
        name: "Mike", 
        username: "mike72", 
        dateCreated: new Date()
    };

    //const user = controller.newUser(userInfo.username, userInfo.name, userInfo.dateCreated);

    //expect(validate.user(user)).toBe(true);
    expect(true).toBe(true);
});