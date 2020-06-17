"use strict";

const users = require("./users.js");
const tasks = require("./tasks.js");
const persistence = require("./persistence.js");

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
 * Asynchronously delete User object from storage.
 * @param {User} user 
 * @returns {boolean} True if successful, false if missing resource in storage.
 */
async function asyncDeleteUser(user) {
    try {
        const userListTable = await persistence.asyncReadListTable(user.uid);
        for (let taskListID of userListTable.getListIDs()) {
            await persistence.asyncDeleteTaskList(taskListID);
        }
        await persistence.asyncDeleteListTable(user.uid);
    } catch (error) {
        if (!/Missing Resource/.test(error.message)) throw error;
    }
    return await persistence.asyncDeleteUser(user.uid);
}

module.exports = {
    asyncNewUser,
    asyncRetrieveUser,
    asyncUpdateUser,
    asyncDeleteUser,
};