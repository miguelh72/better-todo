"use strict";

const mixins = require("./mixins.js");

/**
 * User object that stores an app user's information.
 */
class User extends mixins.mix(
    Object,
    mixins.UniqueID,
    mixins.Account,
    mixins.Creatable,
    mixins.Updatable,
    mixins.Nameable,
) {
    /**
     * @param {string} username 
     * @param {string} name 
     * @param {Date} dateCreated 
     * @throws /Invalid Parameter/ if invalid username, name, or date is provided.
     */
    constructor(username, name = "Guest", dateCreated = new Date()) {
        super({
            uniqueID: username,
            username,
            name,
            dateCreated,
            dateUpdated: dateCreated,
        });
    }
 }

module.exports = {
    User,
}