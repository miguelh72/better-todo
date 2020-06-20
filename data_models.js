"use strict";

const mixins = require("./mixins");
const validate = require("./validation");

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

class TaskList extends mixins.mix(
    Object,
    mixins.UniqueID,
    mixins.Description,
    mixins.Nameable,
    mixins.Archivable,
    mixins.RestrictedContainer,
) {

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

/* class ListTable extends mixins.mix(
    Object,
    mixins.UniqueID,
) {

    constructor(user, taskListArray) {
        validate.user(user);
        taskListArray.forEach(taskList => validate.taskList(taskList));

        super({ uniqueID: user.uid });
        this.userID = user.uid;
        this.__taskLists__ = taskListArray.reduce((listDict, taskList) => {
            listDict[taskList.uid] = ListTable.__reduceTaskList__(taskList);
            return listDict;
        }, {});
        this.implementsListTable = true;
    }

    add(taskList) {
        validate.taskList(taskList);

        this.__taskLists__[taskList.uid] = ListTable.__reduceTaskList__(taskList);
        return true;
    }

    remove(taskListID) {
        validate.uniqueID(taskListID);

        if (this.__taskLists__[taskListID] == null) return false;
        delete this.__taskLists__[taskListID];
        return true;
    }

    getListIDs() {
        return Object.keys(this.__taskLists__).map(id => parseInt(id));
    }

    contains(taskListID) {
        return this.__taskLists__[taskListID] != null;
    }

    get length() { return Object.keys(this.__taskLists__).length; }
    set length(_) { throw new Error("Assignment Error: length is not updatable.") }

    static __reduceTaskList__(taskList) {
        return {
            // TODO add tests for these once controller requires them
            //achived: taskList.archived,
            //completed: taskList.completed,
            //length: taskList.length,
        }
    }
} */

class ListTable extends mixins.mix(
    Object,
    mixins.UniqueID,
) {

    constructor(user, taskListArray) {
        validate.user(user);
        taskListArray.forEach(taskList => validate.taskList(taskList));

        super({ uniqueID: user.uid });
        this.userID = user.uid;
        this.__taskLists__ = taskListArray.reduce((listDict, taskList) => {
            listDict[taskList.uid] = ListTable.__reduceTaskList__(taskList);
            return listDict;
        }, {});
        this.implementsListTable = true;
    }

    add(taskList) {
        validate.taskList(taskList);

        this.__taskLists__[taskList.uid] = ListTable.__reduceTaskList__(taskList);
        return true;
    }

    remove(taskListID) {
        validate.uniqueID(taskListID);

        if (this.__taskLists__[taskListID] == null) return false;
        delete this.__taskLists__[taskListID];
        return true;
    }

    getListIDs() {
        return Object.keys(this.__taskLists__).map(id => parseInt(id));
    }

    contains(taskListID) {
        return this.__taskLists__[taskListID] != null;
    }

    get length() { return Object.keys(this.__taskLists__).length; }
    set length(_) { throw new Error("Assignment Error: length is not updatable.") }

    static __reduceTaskList__(taskList) {
        return {
            // TODO add tests for these once controller requires them
            //achived: taskList.archived,
            //completed: taskList.completed,
            //length: taskList.length,
        }
    }
}

module.exports = {
    User,
    Task,
    TaskList,
    ListTable,
}