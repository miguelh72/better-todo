"use strict";

const validate = require("./validation.js");

function DateCreatedMixin(superclass) {
    return class extends superclass {

        constructor({ dateCreated = new Date() }) {
            validate.date(dateCreated);

            super(...arguments);
            this.__dateCreated__ = dateCreated;
        }

        get dateCreated() { return this.__dateCreated__; }
        set dateCreated(_) { throw new Error("Assignment Error: dateCreated is not updatable.") }
    }
}

function DescriptionMixin(superclass) {
    return class extends superclass {

        constructor({ description = "" }) {
            validate.userDescription(description);

            super(...arguments);
            this.__description__ = description;
        }

        get description() { return this.__description__; }
        set description(description) {
            if (description == null) return false;
            validate.userDescription(description);

            this.__description__ = description;
            return true;
        }
    }
}

function ImportanceMixin(superclass) {
    return class extends superclass {

        constructor({ important = false }) {
            validate.toggle(important);

            super(...arguments);
            this.__isImportant__ = important;
        }

        get important() { return this.__isImportant__; }
        set important(isImportant) {
            validate.toggle(isImportant);

            this.__isImportant__ = isImportant;
        }
    }
}

function UrgencyMixin(superclass) {
    return class extends superclass {
        constructor({ urgent = false, dueDate = null }) {
            validate.toggle(urgent);

            super(...arguments);
            this.__isUrgent__ = urgent;
            this.__dueDate__ = dueDate;
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

function ArchivableMixin(superclass) {
    return class extends superclass {
    
        constructor({ archived = false,   completed = false }) {
            validate.toggle(archived);
            validate.toggle(completed);
            
            super(...arguments);
            this.__isArchived__ = archived;
            this.__isCompleted__ = completed;
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

class Updatable {

    constructor({ dateUpdated = new Date() }) {
        validate.date(dateUpdated);

        this.__dateUpdated__ = dateUpdated;
    }

    get dateUpdated() { return this.__dateUpdated__; }
    set dateUpdated(date) {
        validate.date(date);

        this.__dateUpdated__ = date;
    }
}

class ListContainer {

    constructor({ itemValidator = () => true }) {
        this.__list__ = [];
        this.__isValid__ = itemValidator;
    }

    toArray() {
        return [...this.__list__];
    }

    add(item) {
        if (!this.__isValid__(item)) return false;

        this.__list__.push(item);
        return true;
    }

    remove(item) {
        if (!this.__isValid__(item)) return false;

        const index = this.__list__.findIndex(i => i === item);
        if (index > -1) {
            this.__list__.splice(index, 1);
            return true;
        }
        return false;
    }
}

class Task extends
    DescriptionMixin(
    DateCreatedMixin(
    ImportanceMixin(
    UrgencyMixin(
    ArchivableMixin(
    Updatable))))) {}
                        
const TaskContainer = class extends ListContainer {
    constructor() {
        super({ itemValidator: validate.task });
    }
}
class TaskList extends
    DescriptionMixin(
    ArchivableMixin(
    TaskContainer)) {
            
    get completed() {
        if (this.toArray().length === 0) return true;
        return this.toArray().every(task => task.completed);
    }
    set completed(isCompleted) {
        validate.toggle(isCompleted);
       
        this.toArray().forEach(task => task.completed = isCompleted);
    }
    
    get archived() { return super.archived; }
    set archived(isArchived) {
        validate.toggle(isArchived);
        
        super.archived = isArchived;
        this.toArray().forEach(task => task.archived = isArchived);
    }
}

function create(description, dateCreated, dueDate, isImportant, isUrgent) {
    return new Task({
        description,
        dateCreated,
        dateUpdated: dateCreated,
        dueDate,
        important: isImportant,
        urgent: isUrgent,
    });
}
function createList(description) {
    return new TaskList({
        description,
    });
}
module.exports = { create, createList };