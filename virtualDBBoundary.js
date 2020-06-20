"use strict";

const mixins = require("./mixins");
const { User, Task, TaskList, ListTable } = require("./data_models");

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
    const taskListCopy = new TaskList(taskList.uid, taskList.name, taskList.description);
    Object.assign(taskListCopy, taskList);

    taskListCopy.__container__ = {};
    Object.entries(taskList.__container__).forEach(([key, task]) => {
        taskListCopy.__container__[key] = Object.assign(new Task(), task);
    });
    // TODO will nextUniqueID behave the same between copy and original? Test this

    return taskListCopy;
}

function copyListTable(listTable) {
    const user = new User(listTable.uid);
    const listTableCopy = Object.assign(new ListTable(user, []), listTable);
    listTableCopy.__taskLists__ = Object.assign(new Object(), listTable.__taskLists__);
    return listTableCopy;
}

const virtualUserDB = new UniqueIDVirtualStorage(copyUser);
const virtualTaskListDB = new (mixins.UniqueIDGeneratorMixin(UniqueIDVirtualStorage))(copyTaskList);
const virtualListTableDB = new UniqueIDVirtualStorage(copyListTable);
module.exports = {
    user: virtualUserDB,
    taskList: virtualTaskListDB,
    listTable: virtualListTableDB,
};
