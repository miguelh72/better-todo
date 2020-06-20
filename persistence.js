"use strict";

const validate = require("./validation.js");
const { ListTable } = require("./data_models");
const db = require("./virtualDBBoundary.js");

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
    return db.taskList.nextUniqueID();
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
    asyncUpdateUser,
    asyncDeleteUser,

    asyncNextUniqueTaskListID,
    asyncCreateTaskList,
    asyncReadTaskList,
    asyncReadAllTaskList,
    asyncUpdateTaskList,
    asyncDeleteTaskList,

    createListTable,
    asyncCreateListTable,
    asyncReadListTable,
    asyncReadAllListTable,
    asyncUpdateListTable,
    asyncDeleteListTable,
};
