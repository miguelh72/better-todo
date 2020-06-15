"use strict";

const users = require("./users.js");
const persistence = require("./persistence.js");

async function asyncNewUser(username, name, dateCreated) {
    const newUser = users.create(username, name, dateCreated);
    await persistence.asyncSaveUser(newUser);
    return newUser;
}

module.exports = { asyncNewUser };