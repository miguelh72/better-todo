"use strict";

const validate = require("./validation.js");
const mixins = require("./mixins.js");
const db = require("./virtualDBBoundary.js");

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

async function retrieveAllPromise(db) {
    return db.retrieveAll();
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

async function asyncGetUniqueTaskListID() { 
    return db.taskList.nextUniqueID(); 
}

async function asyncCreateUser(user) { 
    if (db.user.contains(user.uid)) throw new Error("Existing Username: Another user already has that username.");
    return savePromise(db.user, validate.user, user); 
}

async function asyncReadUser(userUID) { 
    return retrievePromise(db.user, userUID) 
}

async function asyncUpdateUser(user) {
    if (!db.user.contains(user.uid)) throw new Error("Missing Resource: No matching user in storage.");
    return savePromise(db.user, validate.user, user); 
}

async function asyncReadAllUsers() { 
    return retrieveAllPromise(db.user) 
}

async function asyncDeleteUser(userUID) { 
    return removePromise(db.user, userUID) 
}

async function asyncSaveTaskList(taskList) { 
    return savePromise(db.taskList, validate.taskList, taskList) 
}

async function asyncReadTaskList(taskListUID) { 
    return retrievePromise(db.taskList, taskListUID) 
}

async function asyncDeleteTaskList(taskListUID) { 
    return removePromise(db.taskList, taskListUID) 
}

function createListTable(user, taskListArray) { 
    return new ListTable(user, taskListArray) 
}

async function asyncSaveListTable(listTable) { 
    return savePromise(db.listTable, () => true, listTable) 
}

async function asyncReadListTable(userUID) {
        validate.uniqueID(userUID);

        return retrievePromise(db.listTable, userUID);
}

async function asyncDeleteListTable(userUID) {
        validate.uniqueID(userUID);

        return removePromise(db.listTable, userUID);
}

module.exports = {
    asyncGetUniqueTaskListID,

    asyncCreateUser,
    asyncReadUser,
    asyncUpdateUser, // TODO add unit tests
    asyncReadAllUsers,
    asyncDeleteUser,

    asyncSaveTaskList, // create or update
    asyncReadTaskList,
    asyncDeleteTaskList,

    createListTable,
    asyncSaveListTable, // create or update
    asyncReadListTable,
    asyncDeleteListTable,
};
