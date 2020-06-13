"use strict";

const persistence = require("./persistence.js");
const users = require("./users.js");
const tasks = require("./tasks.js");
const { task } = require("./validation.js");

/** Users */

test("Save and retrieve new user.", () => {
    const user = users.create();
    const userID = user.uid;

    expect(persistence.saveUser(user)).toBe(true);
    expect(persistence.getUser(userID)).toEqual(user);
});

test("Attempt to retrieve user that doesnt exist", () => {
    const fakeID = 99999999;

    expect(persistence.getUser(fakeID)).toBe(undefined);
    expect(() => persistence.getUser()).toThrow();
});

test("Save and retrieve multiple users", () => {
    const numUsers = 100;

    const userList = [...Array(numUsers).keys()].map(uid => users.create(uid));
    userList.forEach(user => persistence.saveUser(user));
    
    userList.forEach((user, uid) => {
        expect(persistence.getUser(uid)).toEqual(user);
    });
});

/** Task Lists */

test("Save and retrieve new task list", () => {
    const taskList = tasks.createList();
    const taskListUID = taskList.uid;

    expect(persistence.saveTaskList(taskList)).toBe(true);
    expect(persistence.getTaskList(taskListUID)).toEqual(taskList);
});

test("Attempt to retrieve task list that doesnt exist", () => {
    const fakeID = 99999999;

    expect(persistence.getTaskList(fakeID)).toBe(undefined);
    expect(() => persistence.getTaskList()).toThrow();
});

test("Save and retrieve multiple task lists", () => {
    const numTaskLists = 100;

    const taskListArray = [...Array(numTaskLists).keys()].map(uid => tasks.createList(uid));
    taskListArray.forEach(taskList => persistence.saveTaskList(taskList));
    
    taskListArray.forEach((taskList, uid) => {
        expect(persistence.getTaskList(uid)).toEqual(taskList);
    });
});
