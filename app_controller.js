"use strict";

const { User, Task, TaskList, ListTable } = require("./data_models");
const persistence = require("./persistence");
const log = require("./log");

/**
 * Asynchronously create new User object in storage.
 * @param {string} username 
 * @param {string} name 
 * @param {Date} dateCreated 
 * @returns {Promise<User>} User object
 * @throws /Invalid Format/ if username, name, or dateCreated do not validate.
 */
async function asyncNewUser(username, name, dateCreated) {
    let newUser, defaultTaskList, userListTable;
    try {
        newUser = new User(username, name, dateCreated);

        const defaultTaskListID = await persistence.asyncNextUniqueTaskListID();
        defaultTaskList = new TaskList(defaultTaskListID, "default", "Default task list.");
        await persistence.asyncCreateTaskList(defaultTaskList);

        userListTable = new ListTable(newUser, [defaultTaskList]);
        await persistence.asyncCreateListTable(userListTable);

        await persistence.asyncCreateUser(newUser);
    } catch (error) {
        if (!/Invalid Format/.test(error.message)) log.send(error.message);
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
        else {
            log.send(error.message);
            throw error;
        }
    }
}

/**
 * Asynchronously update User object in storage.
 * @param {User} user 
 * @returns {Promise<boolean>} True if successful or false if missing resource in storage.
 */
async function asyncUpdateUser(user) {
    try {
        await persistence.asyncUpdateUser(user);
        return true;
    } catch (error) {
        if (/Missing Resource/.test(error.message)) { return false; }
        log.send(error.message);
        throw error;
    }
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
            userListTable.toArray().map(taskListFeature => persistence.asyncDeleteTaskList(taskListFeature.uid))
        );
        await persistence.asyncDeleteListTable(userUID);
        return await persistence.asyncDeleteUser(userUID);
    } catch (error) {
        if (/Missing Resource/.test(error.message)) { return false }
        log.send(error.message);
        throw error;
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
    const taskList = new TaskList(taskListID, name, description);
    listTable.add(taskList);
    try {
        await persistence.asyncCreateTaskList(taskList);
        await persistence.asyncUpdateListTable(listTable);
        return taskList;
    } catch (error) {
        log.send(error.message);
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
        else {
            log.send(error.message);
            throw error;
        }
    }
}

/**
 * Asynchronously update TaskList object in storage.
 * @param {string} userUID username
 * @param {TaskList} taskList 
 * @returns {Promise<boolean>} True if successful or false if missing resource in storage.
 * @throws /Unauthorized Request/ if task list belongs to another user.
 */
async function asyncUpdateTaskList(userUID, taskList) {
    try {
        const userListTable = await persistence.asyncReadListTable(userUID);
        if (!userListTable.contains(taskList)) {
            try {
                if (await persistence.asyncReadTaskList(taskList.uid) != null) {
                    const message = "Unauthorized Request: Attempted to update another user's task list.";
                    log.send(message);
                    throw new Error(message);
                }
            } catch (error) {
                log.send(error.message);
                throw error;
            }
        }
        await persistence.asyncUpdateTaskList(taskList);
        return true;
    } catch (error) {
        if (/Missing Resource/.test(error.message)) { return false; }
        else {
            log.send(error.message);
            throw error;
        }
    }

}

/**
 * Asynchronously delete TaskList object from storage.
 * @param {string} userUID username
 * @param {number} taskListUID 
 * @returns {Promise<boolean>} True if successful, false if missing resource in storage.
 * @throws /Unauthorized Request/ if attempting to delete another user's task list.
 */
async function asyncDeleteTaskList(userUID, taskListUID) {
    let userListTable = await persistence.asyncReadListTable(userUID);
    try {
        const contained = userListTable.remove(new TaskList(taskListUID)); // matched on uniqueID
        if (!contained) {
            try {
                if (await persistence.asyncReadTaskList(taskListUID) != null) {
                    const message = "Unauthorized Request: Attempted to delete another user's task list.";
                    log.send(message);
                    throw new Error(message);
                }
            } catch (error) {
                log.send(error.message);
                throw error; 
            }
        }
        await Promise.all([
            persistence.asyncUpdateListTable(userListTable),
            persistence.asyncDeleteTaskList(taskListUID),
        ]);
        return true;
    } catch (error) {
        if (/Missing Resource/.test(error.message)) { return false }
        else { 
            log.send(error.message);
            throw error; 
        }
    }
}

function createTask(description = "", dateCreated = new Date(), dueDate = null, isImportant = false, isUrgent = false) {
    return new Task(description, dateCreated, dueDate, isImportant, isUrgent);
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
