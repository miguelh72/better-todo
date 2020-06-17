"use strict";

const validate = require("./validation.js");
const mixins = require("./mixins.js");
const db = require("./virtualDBBoundary.js");

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

    static __reduceTaskList__(taskList) {
        return {
            // TODO add tests for these once controller requires them
            //achived: taskList.archived,
            //completed: taskList.completed,
            //length: taskList.length,
        }
    }
}

async function createPromise(db, validateFunc, saveable) {
    validateFunc(saveable);

    const successful = await db.create(saveable);
    if (!successful) throw new Error("Existing Resource: Resource already in storage.");
    return true;
}

async function readPromise(db, uid) {
    validate.uniqueID(uid);

    const saveable = await db.read(uid);
    if (saveable == null) throw new Error("Missing Resource: Resource does not exist in storage.");
    return saveable;
}

async function readAllPromise(db) {
    return await db.readAll();
}

async function updatePromise(db, validateFunc, saveable) {
    validateFunc(saveable);

    const successful = await db.update(saveable);
    if (!successful) throw new Error("Missing Resource: Resource does not exist in storage.");
    return true;
}

async function deletePromise(db, uid) {
    validate.uniqueID(uid);

    return await db.delete(uid);
}

async function asyncCreateUser(user) {
    return await createPromise(db.user, validate.user, user);
}

async function asyncReadUser(userUID) {
    return await readPromise(db.user, userUID);
}

async function asyncReadAllUsers() {
    return await readAllPromise(db.user)
}

async function asyncUpdateUser(user) {
    return await updatePromise(db.user, validate.user, user);
}

async function asyncDeleteUser(userUID) {
    return await deletePromise(db.user, userUID)
}

async function asyncNextUniqueTaskListID() {
    return await db.taskList.nextUniqueID();
}

async function asyncCreateTaskList(taskList) {
    return await createPromise(db.taskList, validate.taskList, taskList);
}

async function asyncReadTaskList(taskListUID) {
    return await readPromise(db.taskList, taskListUID);
}

async function asyncReadAllTaskList() {
    return await readAllPromise(db.taskList);
}

async function asyncUpdateTaskList(taskList) {
    return await updatePromise(db.taskList, validate.taskList, taskList);
}

async function asyncDeleteTaskList(taskListUID) {
    return await deletePromise(db.taskList, taskListUID);
}

function createListTable(user, taskListArray) {
    return new ListTable(user, taskListArray);
}

async function asyncCreateListTable(listTable) {
    return await createPromise(db.listTable, () => true, listTable);
}

async function asyncReadListTable(userUID) {
    return await readPromise(db.listTable, userUID);
}

async function asyncReadAllListTable() {
    return await readAllPromise(db.listTable);
}

async function asyncUpdateListTable(listTable) {
    return await updatePromise(db.listTable, validate.listTable, listTable);
}

async function asyncDeleteListTable(userUID) {
    return await deletePromise(db.listTable, userUID);
}

module.exports = {
    asyncCreateUser,
    asyncReadUser,
    asyncReadAllUsers,
    asyncUpdateUser, // TODO add unit tests
    asyncDeleteUser,

    asyncNextUniqueTaskListID,
    asyncCreateTaskList,
    asyncReadTaskList,
    asyncReadAllTaskList, // TODO add unit tests
    asyncUpdateTaskList,
    asyncDeleteTaskList,

    createListTable,
    asyncCreateListTable,
    asyncReadListTable,
    asyncReadAllListTable, // TODO add unit tests
    asyncUpdateListTable,
    asyncDeleteListTable,
};
