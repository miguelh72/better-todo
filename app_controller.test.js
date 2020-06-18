"use strict";

// TODO add login system layer

const controller = require("./app_controller.js");
const validate = require("./validation.js");
const persistence = require("./persistence.js");
const users = require("./users.js");
const tasks = require("./tasks.js");
const { task } = require("./validation.js");

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

const testUserInfo = {
    name: "Mike",
    username: "mike72",
    dateCreated: new Date("02/19/2005"),
};

const testTaskListInfo = {
    name: "my task list",
    description: "custom task list",
};

/** Create User */

async function testUserCreation(user) {
    expect(validate.user(user)).toBe(true);

    const userListTable = await persistence.asyncReadListTable(user.uid);
    expect(validate.listTable(userListTable)).toBe(true);

    const defaultTaskListID = userListTable.getListIDs()[0];
    expect(validate.uniqueID(defaultTaskListID)).toBe(true);
    const defaultTaskList = await persistence.asyncReadTaskList(defaultTaskListID);
    expect(validate.taskList(defaultTaskList)).toBe(true);
    expect(defaultTaskList.name).toBe("default");
}

test("Create a new user.", async () => {
    const user = await controller.asyncNewUser(testUserInfo.username, testUserInfo.name, testUserInfo.dateCreated);

    await testUserCreation(user);
    expect(user.uid).toBe(testUserInfo.username);
    expect(user.name).toBe(testUserInfo.name);
    expect(user.dateCreated).toBe(testUserInfo.dateCreated);

    await cleanupPersistence();
});

test("Try to create an invalid user.", async () => {
    await expect(controller.asyncNewUser("73mike", testUserInfo.name, testUserInfo.dateCreated))
        .rejects.toThrow(/Invalid Format/);
    await expect(controller.asyncNewUser(testUserInfo.username, "mike73 Hernan", testUserInfo.dateCreated))
        .rejects.toThrow(/Invalid Format/);
    await expect(controller.asyncNewUser(testUserInfo.username, testUserInfo.name, new Object()))
        .rejects.toThrow(/Invalid Parameter/);
})

test("Create user with existing username", async () => {
    const user = await controller.asyncNewUser(testUserInfo.username, testUserInfo.name, testUserInfo.dateCreated);

    await expect(controller.asyncNewUser(testUserInfo.username, testUserInfo.name, testUserInfo.dateCreated))
        .rejects.toThrow(/Existing Resource/);

    await cleanupPersistence();
});

test("Create many users simultaneously", async () => {
    const numUsers = 100;

    const userArray = await Promise.all(
        [...Array(numUsers).keys()].map(num => controller.asyncNewUser("username" + num))
    );

    for (let user of userArray) {
        await testUserCreation(user);
    }

    await cleanupPersistence();
});

/** Read User */

test("Retrieve existing user", async () => {
    await controller.asyncNewUser(testUserInfo.username, testUserInfo.name, testUserInfo.dateCreated);

    const retrievedUser = await controller.asyncRetrieveUser(testUserInfo.username);
    expect(validate.user(retrievedUser)).toBe(true);
    expect(retrievedUser.uid).toBe(testUserInfo.username);
    expect(retrievedUser.name).toBe(testUserInfo.name);
    expect(retrievedUser.dateCreated).toBe(testUserInfo.dateCreated);

    await cleanupPersistence();
})

test("Try to retrieve user not in persistence.", async () => {
    await expect(controller.asyncRetrieveUser(testUserInfo.username)).resolves.toBe(false);

    await cleanupPersistence();
});

/** Update User */

test("Update User name", async () => {
    const newName = "Miguel";

    const user = await controller.asyncNewUser(testUserInfo.username, testUserInfo.name, testUserInfo.dateCreated);
    user.name = newName;

    await expect(controller.asyncUpdateUser(user)).resolves.toBe(true);

    const retrievedUser = await controller.asyncRetrieveUser(user.username);
    expect(retrievedUser).toEqual(user);

    await cleanupPersistence();
})

test("Try to update User that does not exist", async () => {
    const user = users.create(testUserInfo.username, testUserInfo.name, testUserInfo.dateCreated);

    await expect(controller.asyncUpdateUser(user)).rejects.toThrow(/Missing Resource/);

    await cleanupPersistence();
});

/** Delete User */

test("Delete User from storage", async () => {
    const user = await controller.asyncNewUser(testUserInfo.username, testUserInfo.name, testUserInfo.dateCreated);
    const userListTable = await persistence.asyncReadListTable(user.uid);
    const defaultTaskList = await persistence.asyncReadTaskList(userListTable.getListIDs()[0]);

    await expect(controller.asyncDeleteUser(user.uid)).resolves.toBe(true);
    await expect(persistence.asyncReadListTable(user.uid)).rejects.toThrow(/Missing Resource/);
    await expect(persistence.asyncReadTaskList(defaultTaskList.uid)).rejects.toThrow(/Missing Resource/);

    await cleanupPersistence();
});

test("Try to delete user that does not exist in storage.", async () => {
    const userNotStored = users.create(testUserInfo.username, testUserInfo.name, testUserInfo.dateCreated);

    await expect(controller.asyncDeleteUser(userNotStored.uid)).resolves.toBe(false);
});

/** Create TaskList */

async function testTaskListCreation(user, taskList) {
    expect(validate.uniqueID(taskList.uid)).toBe(true);
    const newTaskList = await persistence.asyncReadTaskList(taskList.uid);
    expect(newTaskList.name).toBe(testTaskListInfo.name);
    expect(newTaskList.description).toBe(testTaskListInfo.description);
}

test("Create new task list", async () => {
    const user = await controller.asyncNewUser(testUserInfo.username, testUserInfo.name, testUserInfo.dateCreated);

    const newTaskList = await controller.asyncNewTaskList(
        user.uid,
        testTaskListInfo.name,
        testTaskListInfo.description,
    );
    testTaskListCreation(user, newTaskList);
    const userListTable = await persistence.asyncReadListTable(user.uid);
    expect(userListTable.getListIDs()[1]).toBe(newTaskList.uid);

    await cleanupPersistence();
});

test("Try to create an invalid task list", async () => {
    const user = await controller.asyncNewUser(testUserInfo.username, testUserInfo.name, testUserInfo.dateCreated);

    await expect(controller.asyncNewTaskList("j&jf87", testTaskListInfo.name, testTaskListInfo.description))
        .rejects.toThrow(/Invalid Format/);
    await expect(controller.asyncNewTaskList(user.uid, "My list 72", testTaskListInfo.description))
        .rejects.toThrow(/Invalid Format/);
    await expect(controller.asyncNewTaskList(user.uid, testTaskListInfo.name, new Object()))
        .rejects.toThrow(/Invalid Parameter/);

    await cleanupPersistence();
});

test("Create many task lists simultaneously", async () => {
    const numTaskLists = 100;
    const user = await controller.asyncNewUser(testUserInfo.username, testUserInfo.name, testUserInfo.dateCreated);

    const taskListArray = await Promise.all(
        [...Array(numTaskLists).keys()].map(
            num => controller.asyncNewTaskList(user.uid, testTaskListInfo.name, testTaskListInfo.description)
        )
    );

    for (let taskList of taskListArray) await testTaskListCreation(user, taskList);

    await cleanupPersistence();
});

/** Read TaskList */

test("Retrieve existing task list", async () => {
    const user = await controller.asyncNewUser(testUserInfo.username, testUserInfo.name, testUserInfo.dateCreated);
    const taskList = await controller.asyncNewTaskList(
        user.uid,
        testTaskListInfo.name,
        testTaskListInfo.description,
    );

    await expect(controller.asyncRetrieveTaskList(taskList.uid)).resolves.toEqual(taskList);

    await cleanupPersistence();
})

test("Try to retrieve task list not in storage.", async () => {
    const user = await controller.asyncNewUser(testUserInfo.username, testUserInfo.name, testUserInfo.dateCreated);
    const taskListNotStored = tasks.createList(user.uid, testTaskListInfo.name, testTaskListInfo.description);

    await expect(controller.asyncRetrieveTaskList(taskListNotStored.uid)).resolves.toBe(false);

    await cleanupPersistence();
});

/** Update TaskList */

// TODO protect against a user updating another user's task list

test("Update task list", async () => {
    const user = await controller.asyncNewUser(testUserInfo.username, testUserInfo.name, testUserInfo.dateCreated);
    const taskList = await controller.asyncNewTaskList(
        user.uid,
        testTaskListInfo.name,
        testTaskListInfo.description,
    );
    taskList.add(tasks.create());
    taskList.name = "A better name";
    taskList.description = "A better description";

    await expect(controller.asyncUpdateTaskList(user.uid, taskList)).resolves.toBe(true);
    await expect(controller.asyncRetrieveTaskList(taskList.uid)).resolves.toEqual(taskList);

    await cleanupPersistence();
})

test("Try to update task list that does not exist", async () => {
    const user = users.create(testUserInfo.username, testUserInfo.name, testUserInfo.dateCreated);
    const taskListNotStored = tasks.createList(user.uid, testTaskListInfo.name, testTaskListInfo.description);

    await expect(controller.asyncUpdateTaskList(user.uid, taskListNotStored)).rejects.toThrow(/Missing Resource/);

    await cleanupPersistence();
});

test("Try to update task list that belongs to another user", async () => {
    const user = await controller.asyncNewUser(testUserInfo.username, testUserInfo.name, testUserInfo.dateCreated);
    const user2 = await controller.asyncNewUser(testUserInfo.username + "2");
    const taskList2 = await controller.asyncNewTaskList(
        user2.uid,
        "another task list name",
        "another description",
    );

    await expect(controller.asyncRetrieveTaskList(taskList2.uid)).resolves.toEqual(taskList2);

    taskList2.name = "better name";
    taskList2.description = "better description";

    await expect(controller.asyncUpdateTaskList(user.uid, taskList2)).rejects.toThrow(/Unauthorized Request/);
    await expect(controller.asyncRetrieveTaskList(taskList2.uid)).resolves.not.toEqual(taskList2);

    await cleanupPersistence();
});

/** Delete TaskList */

test("Delete task list from storage", async () => {
    const user = await controller.asyncNewUser(testUserInfo.username, testUserInfo.name, testUserInfo.dateCreated);
    const taskList = await controller.asyncNewTaskList(
        user.uid,
        testTaskListInfo.name,
        testTaskListInfo.description,
    );

    await expect(controller.asyncDeleteTaskList(user.uid, taskList.uid)).resolves.toBe(true);
    await expect(controller.asyncRetrieveTaskList(taskList.uid)).resolves.toBe(false);

    await cleanupPersistence();
});

test("Try to delete task list that does not exist in storage.", async () => {
    const user = await controller.asyncNewUser(testUserInfo.username, testUserInfo.name, testUserInfo.dateCreated);
    const taskListNotStored = tasks.createList(user.uid, testTaskListInfo.name, testTaskListInfo.description);

    await expect(controller.asyncDeleteTaskList(user.uid, taskListNotStored.uid)).resolves.toBe(false);

    const userNotStored = users.create(testUserInfo.username + "2");
    const taskList = await controller.asyncNewTaskList(
        user.uid,
        testTaskListInfo.name,
        testTaskListInfo.description,
    );

    await expect(controller.asyncDeleteTaskList(userNotStored.uid, taskList.uid)).rejects.toThrow(/Missing Resource/);
    await expect(controller.asyncRetrieveTaskList(taskList.uid)).resolves.toEqual(taskList);

    await cleanupPersistence();
});

test("Try to delete task list that belongs to another user", async () => {
    const user = await controller.asyncNewUser(testUserInfo.username, testUserInfo.name, testUserInfo.dateCreated);
    const taskList = await controller.asyncNewTaskList(
        user.uid,
        testTaskListInfo.name,
        testTaskListInfo.description,
    );
    const user2 = await controller.asyncNewUser(testUserInfo.username + "2");
    const taskList2 = await controller.asyncNewTaskList(
        user2.uid,
        "another task list name",
        "another description",
    );

    await expect(controller.asyncDeleteTaskList(user.uid, taskList2.uid)).rejects.toThrow(/Unauthorized Request/);
    await expect(controller.asyncDeleteTaskList(user2.uid, taskList.uid)).rejects.toThrow(/Unauthorized Request/);
    await expect(controller.asyncRetrieveTaskList(taskList.uid)).resolves.toEqual(taskList);
    await expect(controller.asyncRetrieveTaskList(taskList2.uid)).resolves.toEqual(taskList2);

    await cleanupPersistence();
});

/** Create Task */

test("Create task from user values", () => {
    throw new Error("TODO");
});