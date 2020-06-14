"use strict";

const validate = require("./validation.js");
const { uniqueID, task } = require("./validation.js");

class UniqueIDObjSaver {
    constructor() {
        this.__virtualDB__ = {}
    }

    save(uniqueIDObj) {
        this.__virtualDB__[uniqueIDObj.uid] = uniqueIDObj;
    }

    retrieve(uniqueID) {
        return this.__virtualDB__[uniqueID];
    }
}
const virtualUserDB = new UniqueIDObjSaver();
const virtualTaskListDB = new UniqueIDObjSaver();

// TODO work on this and the retrievePromise function
function savePromise(db, validateFunc, saveable) {
    return new Promise((resolve, reject) => {
        try {
            validateFunc(saveable);

            db.save(saveable);
            resolve(true);
        } catch (error) {
            reject(error);
        }
    });
}

function saveUser(user) {
    return new Promise((resolve, reject) => {
        try {
            validate.user(user);

            virtualUserDB.save(user);
            resolve(true);
        } catch (error) {
            reject(error);
        }
    });
}
function getUser(uid) {
    return new Promise((resolve, reject) => {
        try {
            validate.uniqueID(uid);

            const user = virtualUserDB.retrieve(uid);
            if (user == null) reject(new Error("Missing Resource: User does not exist"));
            resolve(user);
        } catch (error) {
            reject(error);
        }
    });
}

function saveTaskList(taskList) {
    return new Promise((resolve, reject) => {
        try {
            validate.taskList(taskList);

            virtualTaskListDB.save(taskList);
            resolve(true);
        } catch (error) {
            reject(error);
        }
    });
    
}
function getTaskList(uid) {
    return new Promise((resolve, reject) => {
        try {
            validate.uniqueID(uid);

            const taskList = virtualTaskListDB.retrieve(uid);
            if (taskList == null) reject(new Error("Missing Resource: Task list does not exist."));
            resolve(taskList);
        } catch (error) {
            reject(error);
        }
    });
}

module.exports = {
    saveUser,
    getUser,
    saveTaskList,
    getTaskList,
};