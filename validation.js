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

    static containsMixin(obj, objName, ...mixinNameArray) {
        if (obj == null) throw new Error(`Invalid Parameter: received undefined or null instead of ${objName}.`);
        mixinNameArray.forEach(mixinName => {
            if (!obj[`implements${mixinName}`])
                throw new Error(`Invalid Parameter: ${objName} must implement ${mixinName} interface.`);
        })
        return true;
    }

    static task(input) {
        return Validate.containsMixin(input, "Task",
            "Creatable",
            "Updatable",
            "Description",
            "Importance",
            "Urgency",
            "Archivable",
        );
    }

    static taskList(input) {
        return Validate.containsMixin(input, "TaskList", 
            "ListContainer",
            "UniqueID",
            "Description",
            "Nameable",
            "Archivable",
        );
    }

    static user(input) {
        return Validate.containsMixin(input, "User",
            "UniqueID",
            "Account",
            "Creatable",
            "Updatable",
            "Nameable",
        );
    }

    static listTable(input) {
        return Validate.containsMixin(input, "ListTable",
            "UniqueID",
            "ListTable",
        );
    }
}

module.exports = Validate;
