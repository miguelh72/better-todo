"use strict";

const validate = require("./validation.js");
const mixins = require("./mixins.js");
const { mix } = require("./mixins.js");

// TODO replace with persistent unique ID issuing system
let lastID = 0;
function nextAvailableID() {
    lastID++;
    return lastID;
}

class BaseUser {
    constructor({
        id: userID = nextAvailableID(),
        username = null,
    } = {}) {
        validate.userID(userID);
        if (username != null) validate.username(username);

        this.__id__ = userID;
        this.__username__ = username;
    }

    get id() { return this.__id__; }
    set id(_) { throw new Error("Assignment Error: user ID is not updatable.") }

    get username() { return this.__username__; }
    set username(_) { throw new Error("Assignment Error: username is not updatable.") }
}

class User extends mixins.mix(
    BaseUser,
    mixins.DateCreated,
    mixins.Nameable,
) { }

function create(userID, username, name = "Guest", dateCreated) {
    return new User({
        userID,
        username,
        name,
        dateCreated,
    });
}
module.exports = { create };
