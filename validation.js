"use strict";

class Validate {
    // TODO static lettersFollowedByDigitsRegex = /\w+\d*/i;

    static date(input) {
        if (!(input instanceof Date)) throw new Error("Invalid Parameter: Date paramete must be of type Date.");
        return true;
    }

    static userID(input) {
        if (typeof input !== "number") throw new Error("Invalid Parameter: User ID must be of type number.");
        if (!Number.isInteger(input)) throw new Error("Invalid Parameter: User ID must be an integer number.");
        return true;
    }

    static username(input) {
        if (typeof input !== "string") throw new Error("Invalid Parameter: Username must be of type string.");
        // TODO check against RegEx return false
        return true;
    }

    static name(input) {
        if (typeof input !== "string") throw new Error("Invalid Parameter: Name must be of type string.");
        // TODO check against only characters
        return true;
    }

    static userDescription(input) {
        if (typeof input !== "string") throw new Error("Invalid Parameter: Description must be of type string.");
        return true;
    }

    static toggle(input) {
        if (typeof input !== "boolean") throw new Error("Invalid Parameter: Toggle parameter must be boolean.");
        return true;
    }

    static task(input) {
        if (input.dateCreated == null) {
            throw new Error("Invalid Parameter: Task must implement DateCreated interface");
        }
        if (input.description == null) {
            throw new Error("Invalid Parameter: Task must implement Description interface");
        }
        if (input.dateUpdated === undefined) {
            throw new Error("Invalid Parameter: Task must implement Updatable interface.");
        }
        if (input.important == null) {
            throw new Error("Invalid Parameter: Task must implement Importance interface.");
        }
        if (input.urgent == null) {
            throw new Error("Invalid Parameter: Task must implement Urgency interface.");
        }
        return true;
    }
}

module.exports = Validate;
