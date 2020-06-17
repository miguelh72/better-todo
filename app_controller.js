"use strict";

const users = require("./users.js");
const tasks = require("./tasks.js");
const persistence = require("./persistence.js");

// TODO add logging of any errors

/**
 * Asynchronously create new User object in storage.
 * @param {string} username 
 * @param {string} name 
 * @param {Date} dateCreated 
 * @returns {Promise<User>} User object
 */
async function asyncNewUser(username, name, dateCreated) {
    let newUser, defaultTaskList, userListTable;
    try {
        newUser = users.create(username, name, dateCreated);

        const defaultTaskListID = await persistence.asyncNextUniqueTaskListID();
        defaultTaskList = tasks.createList(defaultTaskListID, "default", "Default task list.");
        await persistence.asyncCreateTaskList(defaultTaskList);

        userListTable = persistence.createListTable(newUser, [defaultTaskList]);
        await persistence.asyncCreateListTable(userListTable);

        await persistence.asyncCreateUser(newUser);
    } catch (error) {
        // Cleanup potentially saved resources
        if (defaultTaskList) {
            await persistence.asyncDeleteTaskList(defaultTaskList.uid);
        }
        if (userListTable) {
            await persistence.asyncDeleteListTable(newUser.uid);
        }
        throw error;
    }

    return newUser;
}

/**
 * Asynchronously update User object in storage.
 * @param {User} user 
 * @returns {boolean} True if successful.
 * @throws /Missing Resource/ if user does not exist in storage.
 */
async function asyncUpdateUser(user) {
    await persistence.asyncUpdateUser(user);
    return true;
}

/**
 * Asynchronously fetch/read User object from storage.
 * @param {string} username 
 * @returns {Promise<User>} User object or false if missing resource in storage.
 */
async function asyncRetrieveUser(username) {
    try {
        const user = await persistence.asyncReadUser(username);
        return user;
    } catch (error) {
        if (/Missing Resource/.test(error.message)) { return false; }
        else { throw error }
    }
}

/**
 * Asynchronously delete User object from storage.
 * @param {User} user 
 * @returns {boolean} True if successful, false if missing resource in storage.
 */
async function asyncDeleteUser(user) {
    try {
        const userListTable = await persistence.asyncReadListTable(user.uid);
        await Promise.all(
            userListTable.getListIDs().map(taskListID => persistence.asyncDeleteTaskList(taskListID))
        );
        await persistence.asyncDeleteListTable(user.uid);
        return await persistence.asyncDeleteUser(user.uid);
    } catch (error) {
        if (/Missing Resource/.test(error.message)) { return false }
        else { throw error; }
    }
}

async function asyncNewTaskList(userUID, name, description) {
    const [taskListID, listTable] = await Promise.all([
        await persistence.asyncNextUniqueTaskListID(),
        await persistence.asyncReadListTable(userUID),
    ]);
    const taskList = tasks.createList(taskListID, name, description);
    listTable.add(taskList);
    try {
        await persistence.asyncCreateTaskList(taskList);
        await persistence.asyncUpdateListTable(listTable);
        return taskList;
    } catch (error) {
        // Cleanup potentially saved resources
        await persistence.asyncDeleteTaskList(taskList);
        throw error;
    }
}

module.exports = {
    asyncNewUser,
    asyncRetrieveUser,
    asyncUpdateUser,
    asyncDeleteUser,

    asyncNewTaskList,
};
