"use strict";

const personNameRegex = /^([^\W\d_]+\s*){1,}$/i;
const usernameRegex = /^[^\W\d_]+\w{2,}$/i;

function date(input) {
    if (!(input instanceof Date)) throw new Error("Invalid Parameter: Date paramete must be of type Date.");
    return true;
}

function uniqueID(input) {
    if (input == null) throw new Error("Invalid Parameter: received undefined or null, uniqueID is required.")
    if (typeof input === "string") {
        username(input);
    } else if (typeof input !== "number") {
        throw new Error("Invalid Parameter: unique ID must be of type number or string.");
    } else {
        if (!Number.isInteger(input)) throw new Error("Invalid Parameter: unique ID must be an integer number.");
    }
    return true;
}

function username(input) {
    if (typeof input !== "string") throw new Error("Invalid Parameter: Username must be of type string.");
    if (!usernameRegex.test(input))
        throw new Error("Invalid Format: Username must contain only letters and numbers, start with a letter, and"
            + " be at least 3 characters long.");
    return true;
}

function name(input) {
    if (typeof input !== "string") throw new Error("Invalid Parameter: Name must be of type string.");
    if (!personNameRegex.test(input))
        throw new Error("Invalid Format: Name must contain only letters and spaces, start with a letter, and"
            + " be at least 2 characters long.");
    return true;
}

function description(input) {
    if (typeof input !== "string") throw new Error("Invalid Parameter: Description must be of type string.");
    return true;
}

function toggle(input) {
    if (typeof input !== "boolean") throw new Error("Invalid Parameter: Toggle parameter must be boolean.");
    return true;
}

function containsMixin(obj, objName, ...mixinNameArray) {
    if (obj == null) throw new Error(`Invalid Parameter: received undefined or null instead of ${objName}.`);
    mixinNameArray.forEach(mixinName => {
        if (!obj[`implements${mixinName}`])
            throw new Error(`Invalid Parameter: ${objName} must implement ${mixinName} interface.`);
    })
    return true;
}

function task(input) {
    return containsMixin(input, "Task",
        "Creatable",
        "Updatable",
        "Description",
        "Importance",
        "Urgency",
        "Archivable",
    );
}

function taskList(input) {
    return containsMixin(input, "TaskList",
        "UniqueID",
        "Description",
        "Nameable",
        "Archivable",
        "RestrictedContainer",
    );
}

function user(input) {
    return containsMixin(input, "User",
        "UniqueID",
        "Account",
        "Creatable",
        "Updatable",
        "Nameable",
    );
}

function listTable(input) {
    return containsMixin(input, "ListTable",
        "UniqueID",
        "RestrictedContainer",
        "ListTable",
    );
}

module.exports = {
    date,
    uniqueID,
    username,
    name,
    description,
    toggle,
    task,
    taskList,
    user,
    listTable,
};
