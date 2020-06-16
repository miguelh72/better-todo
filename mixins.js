"use strict";

const validate = require("./validation.js");

function mix(baseClass, ...mixins) {
    if (mixins.length < 1) return baseClass;
    return mixins.reduce((base, mixin) => mixin(base), baseClass);
}

// TODO create error module. Create constructor functions that require expected and received and print useful message.

function Creatable(superclass) {
    return class Creatable extends superclass {

        constructor({ dateCreated = new Date() } = {}) {
            validate.date(dateCreated);

            super(...arguments);
            this.__dateCreated__ = dateCreated;
            this.implementsCreatable = true;
        }

        get dateCreated() { return this.__dateCreated__; }
        set dateCreated(_) { throw new Error("Assignment Error: dateCreated is not updatable.") }
    }
}

function Updatable(superclass) {
    return class Updatable extends superclass {

        constructor({ dateUpdated = new Date() } = {}) {
            validate.date(dateUpdated);

            super(...arguments);
            this.__dateUpdated__ = dateUpdated;
            this.implementsUpdatable = true;
        }

        get dateUpdated() { return this.__dateUpdated__; }
        set dateUpdated(date) {
            validate.date(date);

            this.__dateUpdated__ = date;
        }
    }
}

function UniqueID(superclass) {
    return class UniqueID extends superclass {
        constructor({ uniqueID } = {}) {
            validate.uniqueID(uniqueID);

            super(...arguments);
            this.__uniqueID__ = uniqueID;
            this.implementsUniqueID = true;
        }

        get uid() { return this.__uniqueID__; }
        set uid(_) { throw new Error("Assignment Error: unique ID is not updatable.") }
    }
}

function Account(superclass) {
    return class Account extends superclass {
        constructor({ username = null } = {}) {
            if (username != null) validate.username(username);

            super(...arguments);
            this.__username__ = username;
            this.implementsAccount = true;
        }

        get username() { return this.__username__; }
        set username(_) { throw new Error("Assignment Error: username is not updatable.") }
    }
}

function Nameable(superclass) {
    return class Nameable extends superclass {
        constructor({ name = "Unnamed" } = {}) {
            validate.name(name);

            super(...arguments);
            this.__name__ = name;
            this.implementsNameable = true;
        }

        get name() { return this.__name__; }
        set name(name) {
            validate.name(name);

            this.__name__ = name;
        }
    }
}

function Description(superclass) {
    return class Description extends superclass {

        constructor({ description = "" } = {}) {
            validate.description(description);

            super(...arguments);
            this.__description__ = description;
            this.implementsDescription = true;
        }

        get description() { return this.__description__; }
        set description(description) {
            if (description == null) return false;
            validate.description(description);

            this.__description__ = description;
            return true;
        }
    }
}

function Importance(superclass) {
    return class Importance extends superclass {

        constructor({ important = false } = {}) {
            validate.toggle(important);

            super(...arguments);
            this.__isImportant__ = important;
            this.implementsImportance = true;
        }

        get important() { return this.__isImportant__; }
        set important(isImportant) {
            validate.toggle(isImportant);

            this.__isImportant__ = isImportant;
        }
    }
}

function Urgency(superclass) {
    return class Urgency extends superclass {
        constructor({ urgent = false, dueDate = null } = {}) {
            validate.toggle(urgent);

            super(...arguments);
            this.__isUrgent__ = urgent;
            this.__dueDate__ = dueDate;
            this.implementsUrgency = true;
        }

        get urgent() { return this.__isUrgent__; }
        set urgent(isUrgent) {
            validate.toggle(isUrgent);

            this.__isUrgent__ = isUrgent;
        }

        get dueDate() { return this.__dueDate__; }
        set dueDate(dueDate) {
            validate.date(dueDate);

            this.__dueDate__ = dueDate;
        }
    }
}

function Archivable(superclass) {
    return class Archivable extends superclass {

        constructor({ archived = false, completed = false } = {}) {
            validate.toggle(archived);
            validate.toggle(completed);

            super(...arguments);
            this.__isArchived__ = archived;
            this.__isCompleted__ = completed;
            this.implementsArchivable = true;
        }

        get archived() { return this.__isArchived__; }
        set archived(isArchived) {
            validate.toggle(isArchived);

            this.__isArchived__ = isArchived;
        }

        get completed() { return this.__isCompleted__; }
        set completed(isCompleted) {
            validate.toggle(isCompleted);

            this.__isCompleted__ = isCompleted;
        }
    }
}

module.exports = {
    mix,
    UniqueID,
    Account,
    Creatable,
    Updatable,
    Nameable,
    Description,
    Importance,
    Urgency,
    Archivable,
};