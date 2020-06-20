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

/**
 * Object with database filterable features of TaskList.
 */
class TaskListFeature extends mixins.mix(
    Object,
    mixins.UniqueID,
) {

    /**
     * @param {TaskList} taskList 
     * @throws /Invalid Parameter/ if parameters do not validate.
     */
    constructor(taskList) {
        validate.taskList(taskList);

        super({uniqueID: taskList.uid});
        // TODO add this. properties for features to extract from taskList
        // add tests for these once controller requires them
            //achived: taskList.archived,
            //completed: taskList.completed,
            //length: taskList.length,
    }
}

/**
 * Lookup table that defines which TaskList belong to a user. Contains a TaskListFeature object for each task list that
 * can be used to filter for desired task lists.
 */
class ListTable extends mixins.mix(
    Object,
    mixins.UniqueID,
    mixins.RestrictedContainer,
) {

    /**
     * @param {User} user 
     * @param {Array<TaskList>} taskListArray 
     */
    constructor(user, taskListArray = []) {
        validate.user(user);
        taskListArray.forEach(taskList => validate.taskList(taskList));

        super({ 
            uniqueID: user.uid,
            itemValidatorFunc: validate.taskList,
            comparatorFunc: (taskList1, taskList2) => taskList1.uid === taskList2.uid,
            transformationFunc: taskList => new TaskListFeature(taskList),
        });
        taskListArray.forEach(taskList => super.add(taskList));
        this.implementsListTable = true;
    }
}

module.exports = {
    User,
    Task,
    TaskList,
    ListTable,
}