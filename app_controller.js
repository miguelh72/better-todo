"use strict";

const tasks = require("./tasks.js");
const { User } = require("./data_models");
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
        newUser = new User(username, name, dateCreated);

        const defaultTaskListID = await persistence.asyncNextUniqueTaskListID();
        defaultTaskList = tasks.createList(defaultTaskListID, "default", "Default task list.");
        await persistence.asyncCreateTaskList(defaultTaskList);

        // TODO can both calls below be integrated and hide createListTable call?
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
 * @param {string} userUID username
 * @returns {Promise<User>} User object or false if missing resource in storage.
 */
async function asyncRetrieveUser(userUID) {
    try {
        const user = await persistence.asyncReadUser(userUID);
        return user;
    } catch (error) {
        if (/Missing Resource/.test(error.message)) { return false; }
        else { throw error }
    }
}

/**
 * Asynchronously update User object in storage.
 * @param {User} user 
 * @returns {Promise<boolean>} True if successful.
 * @throws /Missing Resource/ if user does not exist in storage.
 */
async function asyncUpdateUser(user) {
    await persistence.asyncUpdateUser(user);
    return true;
}

/**
 * Asynchronously delete User object from storage.
 * @param {string} userUID username
 * @returns {Promise<boolean>} True if successful, false if missing resource in storage.
 */
async function asyncDeleteUser(userUID) {
    try {
        const userListTable = await persistence.asyncReadListTable(userUID);
        await Promise.all(
            userListTable.getListIDs().map(taskListID => persistence.asyncDeleteTaskList(taskListID))
        );
        await persistence.asyncDeleteListTable(userUID);
        return await persistence.asyncDeleteUser(userUID);
    } catch (error) {
        if (/Missing Resource/.test(error.message)) { return false }
        else { throw error; }
    }
}

/**
 * Asynchronously create a new TaskList object in storage.
 * @param {string} userUID username
 * @param {string} name 
 * @param {string} description 
 * @returns {Promise<TaskList>} TaskList object
 */
async function asyncNewTaskList(userUID, name = "New Task List", description = "") {
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

/**
 * Asynchronously fetch/read TaskList object from storage.
 * @param {number} taskListUID 
 * @returns {Promise<TaskList>} TaskList object or false if missing resource in storage.
 */
async function asyncRetrieveTaskList(taskListUID) {
    try {
        const taskList = await persistence.asyncReadTaskList(taskListUID);
        return taskList;
    } catch (error) {
        if (/Missing Resource/.test(error.message)) { return false; }
        else { throw error }
    }
}

/**
 * Asynchronously update TaskList object in storage.
 * @param {string} userUID username
 * @param {TaskList} taskList 
 * @returns {Promise<boolean>} True if successful. False if attempting to update another user's task list.
 * @throws /Unauthorized Request/ if task list belongs to another user.
 * @throws /Missing Resource/ if task list does not exist in storage.
 */
async function asyncUpdateTaskList(userUID, taskList) {
    const userListTable = await persistence.asyncReadListTable(userUID);
    if (!userListTable.contains(taskList.uid)) {
        try {
            if (await persistence.asyncReadTaskList(taskList.uid) != null) {
                throw new Error("Unauthorized Request: Attempted to update another user's task list."); // TODO log this
            }
        } catch (error) { throw error }
    }
    await persistence.asyncUpdateTaskList(taskList);
    return true;
}

/**
 * Asynchronously delete TaskList object from storage.
 * @param {string} userUID username
 * @param {number} taskListUID 
 * @returns {Promise<boolean>} True if successful, false if missing resource in storage
 * @throws /Unauthorized Request/ if attempting to delete another user's task list.
 */
async function asyncDeleteTaskList(userUID, taskListUID) {
    let userListTable = await persistence.asyncReadListTable(userUID);
    try {
        const contained = userListTable.remove(taskListUID);
        if (!contained) {
            try {
                if (await persistence.asyncReadTaskList(taskListUID) != null) {
                    throw new Error("Unauthorized Request: Attempted to delete another user's task list."); // TODO log this
                }
            } catch (error) { throw error }
        }
        await Promise.all([
            persistence.asyncUpdateListTable(userListTable),
            persistence.asyncDeleteTaskList(taskListUID),
        ]);
        return true;
    } catch (error) {
        if (/Missing Resource/.test(error.message)) { return false }
        else { throw error; }
    }
}

function createTask(description = "", dateCreated = new Date(), dueDate = null, isImportant = false, isUrgent = false) {
    return tasks.create(description, dateCreated, dueDate, isImportant, isUrgent);
}

module.exports = {
    asyncNewUser,
    asyncRetrieveUser,
    asyncUpdateUser,
    asyncDeleteUser,

    asyncNewTaskList,
    asyncRetrieveTaskList,
    asyncUpdateTaskList,
    asyncDeleteTaskList,

    createTask,
};
