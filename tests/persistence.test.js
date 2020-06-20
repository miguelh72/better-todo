"use strict";

const persistence = require("../persistence.js");
const validate = require("../validation.js");
const { User, Task, TaskList } = require("../data_models");

async function cleanupPersistence() {
    await Promise.all(
        (await persistence.asyncReadAllUsers())
            .map(user => persistence.asyncDeleteUser(user.uid))
    );
    await Promise.all(
        (await persistence.asyncReadAllTaskList())
            .map(taskList => persistence.asyncDeleteTaskList(taskList.uid))
    );
    await Promise.all(
        (await persistence.asyncReadAllListTable())
            .map(listTable => persistence.asyncDeleteListTable(listTable.uid))
    );
}

/** Unique IDs */

test("Get next available unique task list ID", async () => {
    const numIDs = 100;

    const uniqueIDArray = await Promise.all(
        [...Array(numIDs)].map(_ => persistence.asyncNextUniqueTaskListID())
    );

    while (uniqueIDArray.length !== 0) {
        const uniqueID = uniqueIDArray.pop();
        expect(validate.uniqueID(uniqueID)).toBe(true);
        expect(uniqueIDArray.includes(uniqueID)).toBe(false);
    }
});

/** Users */

test("Save and retrieve new user.", async () => {
    const user = new User("mike72");

    await expect(persistence.asyncCreateUser(user)).resolves.toBe(true);
    await expect(persistence.asyncReadUser(user.uid)).resolves.toEqual(user);

    await cleanupPersistence();
});

test("Attempt to create user already in storage", async () => {
    const user = new User("mike72");

    await expect(persistence.asyncCreateUser(user)).resolves.toBe(true);
    await expect(persistence.asyncCreateUser(user)).rejects.toThrow(/Existing Resource/);

    await cleanupPersistence();
});

test("Attempt to retrieve user that doesnt exist", async () => {
    const fakeID = "john33";

    await expect(persistence.asyncReadUser(fakeID)).rejects.toThrow(/Missing Resource/);
    await expect(persistence.asyncReadUser()).rejects.toThrow(/Invalid Parameter/);
});

test("Save, update, and retrieve user", async () => {
    const user = new User("mike72", "Miguel", new Date("05/06/1990"));

    await expect(persistence.asyncCreateUser(user)).resolves.toBe(true);
    await expect(persistence.asyncReadUser(user.uid)).resolves.toEqual(user);

    user.name = "Miguel Hernandez";
    user.dateUpdated = new Date();

    await expect(persistence.asyncReadUser(user.uid)).resolves.not.toEqual(user);
    await (expect(persistence.asyncUpdateUser(user))).resolves.toBe(true);
    await expect(persistence.asyncReadUser(user.uid)).resolves.toEqual(user);

    await cleanupPersistence();
});

test("Attempt to update user that does not exist", async () => {
    const user = new User("john33");

    await (expect(persistence.asyncUpdateUser(user))).rejects.toThrow(/Missing Resource/);
});

test("Save and retrieve multiple users", async () => {
    const numUsers = 100;

    const userList = [...Array(numUsers).keys()].map(num => new User("username" + num));

    for (let user of userList) {
        await expect(persistence.asyncCreateUser(user)).resolves.toBe(true);
    }

    for (let user of userList) {
        await expect(persistence.asyncReadUser(user.uid)).resolves.toEqual(user);
    }

    await cleanupPersistence();
});

test("Save multiple users and retrieve all", async () => {
    const numUsers = 100;

    const userList = [...Array(numUsers).keys()].map(num => new User("username" + num));

    await Promise.all(userList.map(user => persistence.asyncCreateUser(user)));
    
    const allUsers = await persistence.asyncReadAllUsers();
    allUsers.forEach(desiredUser => 
        expect(userList.some(user => user.uid === desiredUser.uid)).toBe(true)
    );

    await cleanupPersistence();
});

test("Save and remove multiple users", async () => {
    const numUsers = 100;
    const indexUsersToRemove = [0, 1, 5, 7, 47, 99];

    const userList = [...Array(numUsers).keys()].map(num => new User("username" + num));

    for (let user of userList) {
        await expect(persistence.asyncCreateUser(user)).resolves.toBe(true);
    }

    const removedUsers = [];
    for (let index of indexUsersToRemove) {
        removedUsers.push(userList[index]);
        await expect(persistence.asyncDeleteUser(userList[index].uid)).resolves.toBe(true);
    }

    for (let user of removedUsers) {
        await expect(persistence.asyncReadUser(user.uid)).rejects.toThrow(/Missing Resource/);
    }

    await cleanupPersistence();
});

/** Task Lists */

test("Save and retrieve new task list", async () => {
    const taskList = new TaskList(111);
    taskList.add(new Task());

    await expect(persistence.asyncCreateTaskList(taskList)).resolves.toBe(true);
    await expect(persistence.asyncReadTaskList(taskList.uid)).resolves.toMatchObject(taskList);

    await cleanupPersistence();
});

test("Attempted to create task list already in storage", async () => {
    const taskList = new TaskList(111);
    taskList.add(new Task());

    await expect(persistence.asyncCreateTaskList(taskList)).resolves.toBe(true);
    await expect(persistence.asyncCreateTaskList(taskList)).rejects.toThrow(/Existing Resource/);

    await cleanupPersistence();
});

test("Attempt to retrieve task list that doesnt exist", async () => {
    const fakeID = 99999999;

    await expect(persistence.asyncReadTaskList(fakeID)).rejects.toThrow(/Missing Resource/);
    await expect(persistence.asyncReadTaskList()).rejects.toThrow(/Invalid Parameter/);
});

test("Save and update new task list", async () => {
    const taskList = new TaskList(111, "my list", "my description");
    [...Array(10)].map(_ => taskList.add(new Task()));

    await expect(persistence.asyncCreateTaskList(taskList)).resolves.toBe(true);
    await expect(persistence.asyncReadTaskList(taskList.uid)).resolves.toEqual(taskList);

    taskList.name = "better name";
    taskList.add(new Task());

    await expect(persistence.asyncReadTaskList(taskList.uid)).resolves.not.toEqual(taskList);
    await expect(persistence.asyncUpdateTaskList(taskList)).resolves.toBe(true);
    await expect(persistence.asyncReadTaskList(taskList.uid)).resolves.toEqual(taskList);

    await cleanupPersistence();
});

test("Attempt to update task list that doesnt exist", async () => {
    const taskList = new TaskList(111);

    await expect(persistence.asyncUpdateTaskList(taskList)).rejects.toThrow(/Missing Resource/);
});

test("Save and retrieve multiple task lists", async () => {
    const numTaskLists = 100;

    const taskListArray = [...Array(numTaskLists).keys()].map(uid => new TaskList(uid));

    for (let taskList of taskListArray) {
        await expect(persistence.asyncCreateTaskList(taskList)).resolves.toBe(true);
    }

    for (let taskList of taskListArray) {
        await expect(persistence.asyncReadTaskList(taskList.uid)).resolves.toEqual(taskList);
    }

    await cleanupPersistence();
});

test("Save multiple task lists and retrieve all", async () => {
    const numTaskLists = 100;

    const taskListArray = [...Array(numTaskLists).keys()].map(uid => new TaskList(uid));

    await Promise.all(taskListArray.map(taskList => persistence.asyncCreateTaskList(taskList)));
    
    const allTaskLists = await persistence.asyncReadAllTaskList();
    allTaskLists.forEach(desiredTaskList => 
        expect(taskListArray.some(taskList => taskList.uid === desiredTaskList.uid)).toBe(true)
    );

    await cleanupPersistence();
});

test("Save and remove task lists", async () => {
    const numTaskLists = 100;
    const indexTaskListToRemove = [0, 1, 5, 7, 47, 99];

    const taskListArray = [...Array(numTaskLists).keys()].map(uid => new TaskList(uid));

    for (let taskList of taskListArray) {
        await expect(persistence.asyncCreateTaskList(taskList)).resolves.toBe(true);
    }

    const removedTaskLists = [];
    for (let index of indexTaskListToRemove) {
        removedTaskLists.push(taskListArray[index]);
        await expect(persistence.asyncDeleteTaskList(taskListArray[index].uid)).resolves.toBe(true);
    }

    for (let taskList of removedTaskLists) {
        await expect(persistence.asyncReadTaskList(taskList.uid)).rejects.toThrow(/Missing Resource/);
    }

    await cleanupPersistence();
});

/** List Table */

test("Create list table", () => {
    const numTaskLists = 5;

    const user = new User("mike72");
    const taskListArray = [...Array(numTaskLists).keys()].map(uid => new TaskList(uid));
    const listTable = persistence.createListTable(user, taskListArray);

    expect(listTable.userID).toBe(user.uid);
    expect(listTable.length).toBe(taskListArray.length);
    const listTableListIDs = listTable.getListIDs();
    taskListArray.forEach(taskList => expect(listTableListIDs.includes(taskList.uid)).toBe(true));
});

test("Add and remove from list table", () => {
    const numTaskLists = 5;
    const taskListToAdd = new TaskList(72);
    const taskListIndeciesToRemove = [0, 1, 4];

    const user = new User("mike72");
    const taskListArray = [...Array(numTaskLists).keys()].map(uid => new TaskList(uid));
    const listTable = persistence.createListTable(user, taskListArray);

    taskListArray.push(taskListToAdd);
    expect(listTable.add(taskListToAdd)).toBe(true);
    let listTableListIDs = listTable.getListIDs();
    taskListArray.forEach(taskList => expect(listTableListIDs.includes(taskList.uid)).toBe(true));

    for (let taskListIndexToRemove of taskListIndeciesToRemove) {
        expect(listTable.remove(taskListArray[taskListIndexToRemove].uid)).toBe(true);
        expect(listTable.remove(taskListArray[taskListIndexToRemove].uid)).toBe(false); // not in list
        listTableListIDs = listTable.getListIDs();
        expect(listTableListIDs.includes(taskListArray[taskListIndexToRemove])).toBe(false);
    }
});

test("Save new user's list table", async () => {
    const numTasks = 10;
    const numTaskLists = 10;
    const user = new User("mike72");
    const taskListArray = [...Array(numTaskLists).keys()].map(uid => {
        const taskList = new TaskList(uid);
        [...Array(numTasks)].map(_ => taskList.add(new Task()));
        return taskList;
    });
    const listTable = persistence.createListTable(user, taskListArray);

    await expect(persistence.asyncCreateListTable(listTable)).resolves.toBe(true);

    await cleanupPersistence();
});

test("Attempt to save existing user's list table", async () => {
    const numTasks = 10;
    const numTaskLists = 10;
    const user = new User("mike72");
    const taskListArray = [...Array(numTaskLists).keys()].map(uid => {
        const taskList = new TaskList(uid);
        [...Array(numTasks)].map(_ => taskList.add(new Task()));
        return taskList;
    });
    const listTable = persistence.createListTable(user, taskListArray);

    await expect(persistence.asyncCreateListTable(listTable)).resolves.toBe(true);
    await expect(persistence.asyncCreateListTable(listTable)).rejects.toThrow(/Existing Resource/);

    await cleanupPersistence();
});

test("Save and retrieve new user's list table", async () => {
    const numTasks = 10;
    const numTaskLists = 10;
    const user = new User("mike72");
    const taskListArray = [...Array(numTaskLists).keys()].map(uid => {
        const taskList = new TaskList(uid);
        [...Array(numTasks)].map(_ => taskList.add(new Task()));
        return taskList;
    });
    const listTable = persistence.createListTable(user, taskListArray);

    await expect(persistence.asyncCreateListTable(listTable)).resolves.toBe(true);
    await expect(persistence.asyncReadListTable(listTable.uid)).resolves.toEqual(listTable);

    await cleanupPersistence();
});

test("Attempt to retrieve list table that doesn't exist in storage", async () => {
    const user = new User("mike72");
    const taskListArray = [new TaskList(111)];
    const listTable = persistence.createListTable(user, taskListArray);

    await expect(persistence.asyncReadListTable(listTable.uid)).rejects.toThrow(/Missing Resource/);
});

test("Save multiple list tables and retrieve all", async () => {
    const numListTables = 10;
    const numTaskListsPerTable = 10;

    const userArray = [...Array(numListTables).keys()].map(num => new User("username" + num));
    const listTableArray = [];
    for (let i = 0; i < numListTables; i++) {
        const taskListArray = [];
        for (let j = 0; j < numTaskListsPerTable; j++) {
            taskListArray.push(new TaskList(await persistence.asyncNextUniqueTaskListID()));
        }
        return persistence.createListTable(userArray[i], taskListArray);
    }
    await Promise.all(listTableArray.map(listTable => persistence.asyncCreateListTable(listTable)));
    
    const allListTables = await persistence.asyncReadAllListTable();
    allListTables.forEach(desiredListTable => 
        expect(listTableArray.some(listTable => listTable.uid === desiredListTable.uid)).toBe(true)
    );

    await cleanupPersistence();
});

test("Update list table in storage", async () => {
    const numTasks = 10;
    const numTaskLists = 10;
    const user = new User("mike72");
    const taskListArray = [...Array(numTaskLists).keys()].map(uid => {
        const taskList = new TaskList(uid);
        [...Array(numTasks)].map(_ => taskList.add(new Task()));
        return taskList;
    });
    const listTable = persistence.createListTable(user, taskListArray);

    await expect(persistence.asyncCreateListTable(listTable)).resolves.toBe(true);
    await expect(persistence.asyncReadListTable(listTable.uid)).resolves.toEqual(listTable);

    listTable.add(new TaskList(99));

    await expect(persistence.asyncReadListTable(listTable.uid)).resolves.not.toEqual(listTable);
    await expect(persistence.asyncUpdateListTable(listTable)).resolves.toBe(true);
    await expect(persistence.asyncReadListTable(listTable.uid)).resolves.toEqual(listTable);

    await cleanupPersistence();
});

test("Attempt to update list table that doesnt exist in storage", async () => {
    const user = new User("mike72");
    const taskListArray = [new TaskList(111)];
    const listTable = persistence.createListTable(user, taskListArray);

    await expect(persistence.asyncUpdateListTable(listTable)).rejects.toThrow(/Missing Resource/);
});

test("Save and delete user's list table", async () => {
    const numListTables = 10;
    const numTaskListsPerTable = 10;
    const indexListTablesToRemove = [0,1,5,7,9];

    const userArray = [...Array(numListTables).keys()].map(num => new User("username" + num));
    const listTableArray = [];
    for (let i = 0; i < numListTables; i++) {
        const taskListArray = [];
        for (let j = 0; j < numTaskListsPerTable; j++) {
            taskListArray.push(new TaskList(await persistence.asyncNextUniqueTaskListID()));
        }
        return persistence.createListTable(userArray[i], taskListArray);
    }

    for (let listTable of listTableArray) {
        await expect(persistence.asyncCreateListTable(listTable)).resolves.toBe(true);
    }

    for (let index of indexListTablesToRemove) {
        await expect(persistence.asyncDeleteListTable(userArray[index].uid)).resolves.toBe(true);
    }

    for (let [index, user] of userArray.entries()) {
        if (indexListTablesToRemove.includes(index)) {
            await expect(persistence.asyncReadListTable(userArray[index].uid)).rejects.toThrow(/Missing Resource/);
        } else {
            await expect(persistence.asyncReadListTable(user.uid)).resolves.toEqual(listTableArray[index]);
        }
    }

    await cleanupPersistence();
});
