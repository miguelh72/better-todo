"use strict";

const validate = require("./validation.js");
const mixins = require("./mixins.js");

class UniqueIDObjSaver {
    
    constructor() {
        this.__virtualDB__ = {}
    }

    save(uniqueIDObj) {
        this.__virtualDB__[uniqueIDObj.uid] = uniqueIDObj;
        return true;
    }

    retrieve(uniqueID) {
        return this.__virtualDB__[uniqueID];
    }

    remove(uniqueID) {
        if (this.__virtualDB__[uniqueID] == null) return false;
        delete this.__virtualDB__[uniqueID];
        return true;
    }
}
const virtualUserDB = new UniqueIDObjSaver();
const virtualTaskListDB = new UniqueIDObjSaver();
const virtualListTableDB = new UniqueIDObjSaver();

function savePromise(db, validateFunc, saveable) {
    return new Promise((resolve, reject) => {
        try {
            validateFunc(saveable);

            resolve(db.save(saveable));
        } catch (error) {
            reject(error);
        }
    });
}

function retrievePromise(db, uid) {
    return new Promise((resolve, reject) => {
        try {
            validate.uniqueID(uid);

            const saveable = db.retrieve(uid);
            if (saveable == null) reject(new Error("Missing Resource: Resource does not exist"));
            resolve(saveable);
        } catch (error) {
            reject(error);
        }
    });
}

function removePromise(db, uid) {
    return new Promise((resolve, reject) => {
        try {
            validate.uniqueID(uid);

            resolve(db.remove(uid));
        } catch (error) {
            reject(error);
        }
    });
}

class ListTable extends mixins.UniqueID(Object) {

    constructor(user, taskListArray) {
        validate.user(user);
        taskListArray.forEach(taskList => validate.taskList(taskList));

        super({ uniqueID: user.uid });
        this.userID = user.uid;
        this.__taskLists__ = taskListArray.reduce((listDict, taskList) => {
            listDict[taskList.uid] = {
                // TODO add tests for these once controller requires them
                //achived: taskList.archived,
                //completed: taskList.completed,
                //length: taskList.length,
            }
            return listDict;
        }, {});
        this.implementsListTable = true;
    }

    add(taskList) {
        validate.taskList(taskList);

        this.__taskLists__[taskList.uid] = taskList;
        return true;
    }

    remove(taskList) {
        validate.taskList(taskList);

        if (this.__taskLists__[taskList.uid] == null) return false;
        delete this.__taskLists__[taskList.uid];
        return true;
    }

    getListIDs() {
        return Object.keys(this.__taskLists__).map(id => parseInt(id));
    }

    get length() { return Object.keys(this.__taskLists__).length; }
    set length(_) { throw new Error("Assignment Error: length is not updatable.") }
}

module.exports = {
    saveUser: user => savePromise(virtualUserDB, validate.user, user),
    getUser: uid => retrievePromise(virtualUserDB, uid),
    removeUser: uid => removePromise(virtualUserDB, uid),

    saveTaskList: taskList => savePromise(virtualTaskListDB, validate.taskList, taskList),
    getTaskList: uid => retrievePromise(virtualTaskListDB, uid),
    removeTaskList: uid => removePromise(virtualTaskListDB, uid),

    createListTable: (user, taskListArray) => new ListTable(user, taskListArray),
    saveListTable: listTable => savePromise(virtualListTableDB, () => true, listTable),
    getListTable: user => {
        validate.user(user);

        return retrievePromise(virtualListTableDB, user.uid);
    },
    removeListTable: user => {
        validate.user(user);

        return removePromise(virtualListTableDB, user.uid);
    }
};
