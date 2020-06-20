"use strict";

const mixins = require("./mixins");
const validate = require("./validation");
const { task } = require("./validation");

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
     * @throws /Invalid Parameter/ if parameters do not validate.
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
     * @throws /Invalid Parameter/ if parameters do not validate.
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

/**
 * Object that stores multiple Task objects belonging to a user's defined task group.
 */
class TaskList extends mixins.mix(
    Object,
    mixins.UniqueID,
    mixins.Description,
    mixins.Nameable,
    mixins.Archivable,
    mixins.RestrictedContainer,
) {

    /**
     * @param {number} taskListID 
     * @param {string} name 
     * @param {string} description 
     * @throws /Invalid Parameter/ if parameters do not validate.
     */
    constructor(taskListID, name, description) {
        super({
            uniqueID: taskListID,
            name,
            description,
            itemValidatorFunc: validate.task,
        });
    }

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

class TaskListFeature extends mixins.mix(
    Object,
    mixins.UniqueID,
) {
    constructor(taskList) {
        validate.taskList(taskList);

        super({uniqueID: taskList.uid});
        // TODO add this. properties for features to extract from taskList
        // add tests for these once controller requires them
            //achived: taskList.archived,
            //completed: taskList.completed,
            //length: taskList.length,
    }

    static fromTaskListIDOnly(taskListID) {
        validate.uniqueID(taskListID);

        return new TaskListFeature(new TaskList(taskListID));
    }
}

class ListTable extends mixins.mix(
    Object,
    mixins.UniqueID,
    mixins.RestrictedContainer,
) {

    constructor(user, taskListArray = []) {
        validate.user(user);
        taskListArray.forEach(taskList => validate.taskList(taskList));

        super({ 
            uniqueID: user.uid,
            itemValidatorFunc: item => item instanceof TaskListFeature,
            comparatorFunc: (taskList1, taskList2) => taskList1.uid === taskList2.uid,
        });
        taskListArray
            .map(taskList => new TaskListFeature(taskList))
            .forEach(taskListFeature => super.add(taskListFeature));
        this.implementsListTable = true;
    }

    add(taskList) {
        // Warning: Violates Liskov's Substitution Principle, since RestrictedContainer expects what is passed to add
        // to be saved, but instead we save a TaskListFeature object instead of a TaskList object.

        return super.add(new TaskListFeature(taskList));
    }

    remove(taskListID) {
        // Warning: Violates Liskov's Substitution Principle, since RestrictedContainer expects what is passed to be
        // removed, but instead we remove a TaskListFeature object instead of a number object.

        validate.uniqueID(taskListID);

        return super.remove(TaskListFeature.fromTaskListIDOnly(taskListID));
    }

    contains(taskListID) {
        // Warning: Violates Liskov's Substitution Principle, since RestrictedContainer expects what is passed to be
        // found in container, but instead we match a TaskListFeature object instead of a number object.

        return super.contains(TaskListFeature.fromTaskListIDOnly(taskListID));
    }
}

module.exports = {
    User,
    Task,
    TaskList,
    ListTable,
}