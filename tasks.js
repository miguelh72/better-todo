"use strict";

const validate = require("./validation.js");
const mixins = require("./mixins.js");

class Updatable {

    constructor({ dateUpdated = new Date() } = {}) {
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

    constructor({ itemValidator = () => true } = {}) {
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

class Task extends mixins.mix(
    Updatable,
    mixins.DateCreated,
    mixins.Description,
    mixins.Importance,
    mixins.Urgency,
    mixins.Archivable,
) { }

class TaskContainer extends ListContainer {

    constructor() {
        super({ itemValidator: validate.task });
    }
}

class TaskList extends mixins.mix(
    TaskContainer,
    mixins.Description,
    mixins.Archivable,
) {

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