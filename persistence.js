"use strict";

const validate = require("./validation.js");
const mixins = require("./mixins.js");

class UniqueIDObjSaver {
    
    constructor() {
        this.__virtualDB__ = {}
        this.__nextUniqueID__ = 1;
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

    nextUniqueID() {
        return this.__nextUniqueID__++;
    }
}
const virtualUserDB = new UniqueIDObjSaver();
const virtualTaskListDB = new UniqueIDObjSaver();
const virtualListTableDB = new UniqueIDObjSaver();

async function savePromise(db, validateFunc, saveable) {
    validateFunc(saveable);

    return db.save(saveable);
}

async function retrievePromise(db, uid) {
    validate.uniqueID(uid);

    const saveable = db.retrieve(uid);
    if (saveable == null) throw new Error("Missing Resource: Resource does not exist");
    return saveable;      
}

async function removePromise(db, uid) {
    validate.uniqueID(uid);

    return db.remove(uid);
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

async function asyncGetUniqueTaskListID() { return virtualTaskListDB.nextUniqueID(); }

async function asyncSaveUser(user) { return savePromise(virtualUserDB, validate.user, user); }
async function asyncGetUser(uid) { return retrievePromise(virtualUserDB, uid) }
async function asyncRemoveUser(uid) { return removePromise(virtualUserDB, uid) }

async function asyncSaveTaskList(taskList) { return savePromise(virtualTaskListDB, validate.taskList, taskList) }
async function asyncGetTaskList(uid) { return retrievePromise(virtualTaskListDB, uid) }
async function asyncRemoveTaskList(uid) { return removePromise(virtualTaskListDB, uid) }

function createListTable(user, taskListArray) { return new ListTable(user, taskListArray) }
async function asyncSaveListTable(listTable) { return savePromise(virtualListTableDB, () => true, listTable) }
async function asyncGetListTable(user) {
        validate.user(user);

        return retrievePromise(virtualListTableDB, user.uid);
}
async function asyncRemoveListTable(user) {
        validate.user(user);

        return removePromise(virtualListTableDB, user.uid);
}

module.exports = {
    asyncGetUniqueTaskListID,

    asyncSaveUser,
    asyncGetUser,
    asyncRemoveUser,

    asyncSaveTaskList,
    asyncGetTaskList,
    asyncRemoveTaskList,

    createListTable,
    asyncSaveListTable,
    asyncGetListTable,
    asyncRemoveListTable,
};
