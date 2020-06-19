"use strict";

const mixins = require("./mixins.js");

/**
 * Object that stores an app user's information.
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

 /**
  * Object that stores a TODO task's information.
  */
 class Task extends mixins.mix(
    Object,
    mixins.Creatable,
    mixins.Updatable,
    mixins.Description,
    mixins.Importance,
    mixins.Urgency,
    mixins.Archivable,
) {
    /**
     * @param {string} description 
     * @param {Date} dateCreated 
     * @param {Date} dueDate 
     * @param {boolean} isImportant 
     * @param {boolean} isUrgent 
     */
    constructor(description = "", dateCreated = new Date(), dueDate = null, isImportant = false, isUrgent = false) {
        super({
            description,
            dateCreated,
            dateUpdated: dateCreated,
            dueDate,
            important: isImportant,
            urgent: isUrgent,
        });
    }
}

module.exports = {
    User,
    Task,
}