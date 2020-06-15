"use strict";

const persistence = require("./persistence.js");
const users = require("./users.js");
const tasks = require("./tasks.js");
const validate = require("./validation.js");

/** Users */

test("Save and retrieve new user.", async () => {
    const user = users.create();
    const userID = user.uid;

    await expect(persistence.saveUser(user)).resolves.toBe(true);
    await expect(persistence.getUser(userID)).resolves.toEqual(user);
});

test("Attempt to retrieve user that doesnt exist", async () => {
    const fakeID = 99999999;

    await expect(persistence.getUser(fakeID)).rejects.toThrow(/Missing Resource/);
    await expect(persistence.getUser()).rejects.toThrow(/Invalid Parameter/);
});

test("Save and retrieve multiple users", async() => {
    const numUsers = 100;

    const userList = [...Array(numUsers).keys()].map(uid => users.create(uid));
    
    for (let user of userList) {
        await expect(persistence.saveUser(user)).resolves.toBe(true);
    }

    for (let user of userList) {
        await expect(persistence.getUser(user.uid)).resolves.toEqual(user);
    }
});

test("Save and remove users", async () => {
    const numUsers = 100;
    const indexUsersToRemove = [0,1,5,7,47,99];

    const userList = [...Array(numUsers).keys()].map(uid => users.create(uid));
    
    for (let user of userList) {
        await expect(persistence.saveUser(user)).resolves.toBe(true);
    }

    const removedUsers = [];
    for (let index of indexUsersToRemove) {
        removedUsers.push(userList[index]);
        await expect(persistence.removeUser(userList[index].uid)).resolves.toBe(true);
    }

    for (let user of removedUsers) {
        await expect(persistence.getUser(user.uid)).rejects.toThrow(/Missing Resource/);
    }
});

/** Task Lists */

test("Save and retrieve new task list", async () => {
    const taskList = tasks.createList();
    const taskListUID = taskList.uid;

    await expect(persistence.saveTaskList(taskList)).resolves.toBe(true);
    await expect(persistence.getTaskList(taskListUID)).resolves.toEqual(taskList);
});

test("Attempt to retrieve task list that doesnt exist", async () => {
    const fakeID = 99999999;

    await expect(persistence.getTaskList(fakeID)).rejects.toThrow(/Missing Resource/);
    await expect(persistence.getTaskList()).rejects.toThrow(/Invalid Parameter/);
});

test("Save and retrieve multiple task lists", async () => {
    const numTaskLists = 100;

    const taskListArray = [...Array(numTaskLists).keys()].map(uid => tasks.createList(uid));
    
    for (let taskList of taskListArray) {
        await expect(persistence.saveTaskList(taskList)).resolves.toBe(true);
    }

    for (let taskList of taskListArray) {
        await expect(persistence.getTaskList(taskList.uid)).resolves.toEqual(taskList);
    }
});

test("Save and remove task lists", async () => {
    const numTaskLists = 100;
    const indexTaskListToRemove = [0,1,5,7,47,99];

    const taskListArray = [...Array(numTaskLists).keys()].map(uid => tasks.createList(uid));
    
    for (let taskList of taskListArray) {
        await expect(persistence.saveTaskList(taskList)).resolves.toBe(true);
    }

    const removedTaskLists = [];
    for (let index of indexTaskListToRemove) {
        removedTaskLists.push(taskListArray[index]);
        await expect(persistence.removeTaskList(taskListArray[index].uid)).resolves.toBe(true);
    }

    for (let taskList of removedTaskLists) {
        await expect(persistence.getTaskList(taskList.uid)).rejects.toThrow(/Missing Resource/);
    }
});

/** List Table */

test("Create list table", () => {
    const numTaskLists = 5;

    const user = users.create();
    const taskListArray = [...Array(numTaskLists).keys()].map(_ => tasks.createList());
    const listTable = persistence.createListTable(user, taskListArray);

    expect(listTable.userID).toBe(user.uid);
    expect(listTable.length).toBe(taskListArray.length);
    const listTableListIDs = listTable.getListIDs();
    taskListArray.forEach(taskList => expect(listTableListIDs.includes(taskList.uid)).toBe(true));
});

test("Add and remove from list table", () => {
    const numTaskLists = 5;
    const taskListToAdd = tasks.createList(72);
    const taskListIndexToRemove = 1;

    const user = users.create();
    const taskListArray = [...Array(numTaskLists).keys()].map(_ => tasks.createList());
    const listTable = persistence.createListTable(user, taskListArray);

    taskListArray.push(taskListToAdd);
    expect(listTable.add(taskListToAdd)).toBe(true);
    let listTableListIDs = listTable.getListIDs();
    taskListArray.forEach(taskList => expect(listTableListIDs.includes(taskList.uid)).toBe(true));

    expect(listTable.remove(taskListArray[taskListIndexToRemove])).toBe(true);
    expect(listTable.remove(taskListArray[taskListIndexToRemove])).toBe(false); // not in list
    listTableListIDs = listTable.getListIDs();
    expect(listTableListIDs.includes(taskListArray[taskListIndexToRemove])).toBe(false);
});

test("Save user's list table", async () => {
    const numTaskLists = 10;

    const user = users.create();
    const taskListArray = [...Array(numTaskLists).keys()].map(_ => tasks.createList());
    const listTable = persistence.createListTable(user, taskListArray);

    await expect(persistence.saveListTable(listTable)).resolves.toBe(true);
});

test("Save and retrieve user's list table", async () => {
    const numTaskLists = 10;

    const user = users.create();
    const taskListArray = [...Array(numTaskLists).keys()].map(_ => tasks.createList());
    const listTable = persistence.createListTable(user, taskListArray);

    await expect(persistence.saveListTable(listTable)).resolves.toBe(true);
    
    const returnedListTable = await persistence.getListTable(user);
    expect(validate.listTable(returnedListTable)).toBe(true);
    let listTableListIDs = returnedListTable.getListIDs();
    taskListArray.forEach(taskList => expect(listTableListIDs.includes(taskList.uid)).toBe(true));
});

test("Save and remove user's list table", async () => {
    const numListTables = 10;
    const numTaskListsPerTable = 10;
    const indexListTablesToRemove = [0,1,5,7,9];

    const userArray = [...Array(numListTables).keys()].map(uid => users.create(uid));
    const listTableArray = userArray.map(user => {
        const taskLists = [...Array(numTaskListsPerTable).keys()].map(_ => tasks.createList());
        return persistence.createListTable(user, taskLists);
    });
    
    for (let listTable of listTableArray) {
        await expect(persistence.saveListTable(listTable)).resolves.toBe(true);
    }

    for (let index of indexListTablesToRemove) {
        await expect(persistence.removeListTable(userArray[index])).resolves.toBe(true);
    }

    for (let index of indexListTablesToRemove) {
        await expect(persistence.getListTable(userArray[index])).rejects.toThrow(/Missing Resource/);
    }

    for (let [index, user] of userArray.entries()) {
        if (!indexListTablesToRemove.includes(index)) {
            await expect(persistence.getListTable(user)).resolves.toEqual(listTableArray[index]);
        }
    }
});

test("Attempt to retrieve list table that doesnt exist", async () => {
    const fakeID = 99999999;

    const fakeUser = users.create(fakeID);

    await expect(persistence.getListTable(fakeUser)).rejects.toThrow(/Missing Resource/);
    await expect(new Promise((resolve, reject) => {
        try { resolve(persistence.getListTable()) }
        catch (error) { reject(error) }
    })).rejects.toThrow(/Invalid Parameter/);
});
