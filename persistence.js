"use strict";

const validate = require("./validation.js");

class UniqueIDObjSaver {
    constructor(validationFunc) {
        this.__virtualDB__ = {}
        this.__validate__ = validationFunc;
    }

    save(uniqueIDObj) {
        this.__validate__(uniqueIDObj);

        this.__virtualDB__[uniqueIDObj.uid] = uniqueIDObj;
    }

    retrieve(uniqueID) {
        validate.uniqueID(uniqueID);

        return this.__virtualDB__[uniqueID];
    }
}

const virtualUserDB = new UniqueIDObjSaver(validate.user);
const virtualTaskListDB = new UniqueIDObjSaver(validate.taskList);

// TODO simulate asynchronous calls, return promises
function saveUser(user) {
    virtualUserDB.save(user);
    return true;
}
function getUser(uid) {
    return virtualUserDB.retrieve(uid);
}

function saveTaskList(taskList) {
    virtualTaskListDB.save(taskList);
    return true;
}
function getTaskList(uid) {
    return virtualTaskListDB.retrieve(uid);
}

module.exports = {
    saveUser,
    getUser,
    saveTaskList,
    getTaskList,
};