"use strict";

class Validate {
    static personNameRegex = /^([^\W\d_]+\s*){1,}$/i;
    static usernameRegex = /^[^\W\d_]+\w{2,}$/i;

    static date(input) {
        if (!(input instanceof Date)) throw new Error("Invalid Parameter: Date paramete must be of type Date.");
        return true;
    }

    static uniqueID(input) {
        if (typeof input !== "number") throw new Error("Invalid Parameter: User ID must be of type number.");
        if (!Number.isInteger(input)) throw new Error("Invalid Parameter: User ID must be an integer number.");
        return true;
    }

    static username(input) {
        if (typeof input !== "string") throw new Error("Invalid Parameter: Username must be of type string.");
        if (!Validate.usernameRegex.test(input)) return false;
        return true;
    }

    static name(input) {
        if (typeof input !== "string") throw new Error("Invalid Parameter: Name must be of type string.");
        if (!Validate.personNameRegex.test(input)) return false;
        return true;
    }

    static description(input) {
        if (typeof input !== "string") throw new Error("Invalid Parameter: Description must be of type string.");
        return true;
    }

    static toggle(input) {
        if (typeof input !== "boolean") throw new Error("Invalid Parameter: Toggle parameter must be boolean.");
        return true;
    }

    // TODO consider using an isMixinName = true property and testing against it using a DRY function call with mixin to test against
    static task(input) {
        if (input == null) throw new Error("Invalid Parameter: received undefined or null instead of task.");
        if (input.dateCreated == null) throw new Error("Invalid Parameter: Task must implement Creatable interface");
        if (input.dateUpdated === undefined) throw new Error("Invalid Parameter: Task must implement Updatable interface.");
        if (input.description == null) throw new Error("Invalid Parameter: Task must implement Description interface");
        if (input.important == null) throw new Error("Invalid Parameter: Task must implement Importance interface.");
        if (input.urgent == null) throw new Error("Invalid Parameter: Task must implement Urgency interface.");
        if (input.archived == null) throw new Error("Invalid Parameter: Task must implement Archivable interface");
        if (input.completed == null) throw new Error("Invalid Parameter: Task must implement Archivable interface");
        return true;
    }

    static taskList(input) {
        if (input == null) throw new Error("Invalid Parameter: received undefined or null instead of task list.");
        if (input.add == null) throw new Error("Invalid Parameter: Task list must implement ListContainer interface");
        if (input.description == null) throw new Error("Invalid Parameter: Task list must implement Description interface");
        if (input.name == null) throw new Error("Invalid Parameter: Task list must implement Nameable interface");
        if (input.archived == null) throw new Error("Invalid Parameter: Task list must implement Archivable interface");
        if (input.completed == null) throw new Error("Invalid Parameter: Task list must implement Archivable interface");
        return true;
    }

    static user(input) {
        if (input == null) throw new Error("Invalid Parameter: received undefined or null instead of User.");
        if (input.dateCreated == null) throw new Error("Invalid Parameter: User must implement Creatable interface");
        if (input.dateUpdated === undefined) throw new Error("Invalid Parameter: User must implement Updatable interface.");
        if (input.uid == null) throw new Error("Invalid Parameter: User must implement UniqueID interface");
        if (input.username === undefined) throw new Error("Invalid Parameter: User must implement Account interface");
        if (input.name == null) throw new Error("Invalid Parameter: User must implement Nameable interface");
        return true;
    }

    static listTable(input) {
        if (input == null) throw new Error("Invalid Parameter: received undefined or null instead of list table.");
        if (input.uid == null) throw new Error("Invalid Parameter: List table must implement UniqueID interface");
        if (input.add == null) throw new Error("Invalid Parameter: List Table must implement add/remove contract");
        if (input.remove == null) throw new Error("Invalid Parameter: List Table must implement add/remove contract");
        return true;
    }
}

module.exports = Validate;
