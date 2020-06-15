"use strict";

const users = require("./users.js");
const persistence = require("./persistence.js");

function newUser(username, name, dateCreated) {
    return users.create(persistence.asyncGetUniqueUserID(), username, name, dateCreated);
}

module.exports = { newUser };