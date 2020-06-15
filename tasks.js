"use strict";

const validate = require("./validation.js");
const mixins = require("./mixins.js");

class ListContainer {

    constructor({ itemValidator = () => true } = {}) {
        this.__list__ = [];
        this.__isValid__ = itemValidator;
        this.implementsListContainer = true;
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

    get length() { return this.__list__.length; }
    set length(_) { throw new Error("Assignment Error: length is not updatable.") }
}

class Task extends mixins.mix(
    Object,
    mixins.Creatable,
    mixins.Updatable,
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
    mixins.UniqueID,
    mixins.Description,
    mixins.Nameable,
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
function createList(taskListID, name, description) {
    return new TaskList({
        uniqueID: taskListID,
        name,
        description,
    });
}
module.exports = { create, createList };