"use strict";

const validate = require("./validation.js");
const { User } = require("./data_models");

const tasks = require("./tasks.js");
const mixins = require("./mixins.js");

// WARNING: Below is copy paste from persistence module. Only reason I'm doing this is because this is a temporary
// emulation of a db boundary and will be refactored once a db is chosen.
class ListTable extends mixins.UniqueID(Object) {

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
        return {}
    }
}

function uniqueIDGeneratorMixin(superclass) {
    return class uniqueIDGeneratorMixin extends superclass {
        constructor() {
            super(...arguments);
        }

        static __generator__ = (function* () {
            let i = 1;
            while (true) yield i++;
        })()

        async nextUniqueID() {
            return uniqueIDGeneratorMixin.__generator__.next().value;
        }
    }
}

class UniqueIDVirtualStorage {

    constructor(copyFunc) {
        if (typeof copyFunc !== "function") throw new Error("Invalid Parameter: copyFunc must be a function that"
            + " generated a deep copy of uniqueID object.");

        this.__copyFunc__ = copyFunc;
        this.__virtualDB__ = {}
    }

    async create(uniqueIDObj) {
        if (this.__virtualDB__[uniqueIDObj.uid] != null) return false;
        this.__virtualDB__[uniqueIDObj.uid] = this.__copyFunc__(uniqueIDObj);
        return true;
    }

    async read(uniqueID) {
        const uniqueIDObj = this.__virtualDB__[uniqueID];
        return (uniqueIDObj != null) ? this.__copyFunc__(uniqueIDObj) : uniqueIDObj;
    }

    async readAll() {
        return Object.values(this.__virtualDB__)
            .map(uniqueIDObj => this.__copyFunc__(uniqueIDObj));
    }

    async update(uniqueIDObj) {
        if (this.__virtualDB__[uniqueIDObj.uid] == null) return false;
        this.__virtualDB__[uniqueIDObj.uid] = this.__copyFunc__(uniqueIDObj);
        return true;
    }

    async delete(uniqueID) {
        if (this.__virtualDB__[uniqueID] == null) return false;
        delete this.__virtualDB__[uniqueID];
        return true;
    }

    async contains(uniqueID) {
        return this.__virtualDB__[uniqueID] != null;
    }
}

function copyUser(user) {
    return Object.assign(new User(user.username), user);
}

function copyTaskList(taskList) {
    const taskListCopy = tasks.createList(taskList.uid, taskList.name, taskList.description);
    taskList.toArray().forEach(task => taskListCopy.add(Object.assign(tasks.create(), task)));
    return taskListCopy;
}

function copyListTable(listTable) {
    const user = new User(listTable.uid);
    const listTableCopy = Object.assign(new ListTable(user, []), listTable);
    listTableCopy.__taskLists__ = Object.assign(new Object(), listTable.__taskLists__);
    return listTableCopy;
}

const virtualUserDB = new UniqueIDVirtualStorage(copyUser);
const virtualTaskListDB = new (uniqueIDGeneratorMixin(UniqueIDVirtualStorage))(copyTaskList);
const virtualListTableDB = new UniqueIDVirtualStorage(copyListTable);
module.exports = {
    user: virtualUserDB,
    taskList: virtualTaskListDB,
    listTable: virtualListTableDB,
};
