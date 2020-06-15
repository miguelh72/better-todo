"use strict";

const validate = require("./validation.js");
const mixins = require("./mixins.js");

class User extends mixins.mix(
    Object,
    mixins.UniqueID,
    mixins.Account,
    mixins.Creatable,
    mixins.Updatable,
    mixins.Nameable,
) { }

function create(userID, username, name = "Guest", dateCreated) {
    return new User({
        uniqueID: userID,
        username,
        name,
        dateCreated,
        dateUpdated: dateCreated,
    });
}
module.exports = { create };
