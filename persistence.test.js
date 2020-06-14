"use strict";

const persistence = require("./persistence.js");
const users = require("./users.js");
const tasks = require("./tasks.js");

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
