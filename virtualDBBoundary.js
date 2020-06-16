"use strict";

const users = require("./users.js");

// TODO refactor out of persistence module and standardize interface

class VirtualUserDB {
    
    constructor() {
        this.__virtualDB__ = {}
    }

    save(user) {
        this.__virtualDB__[user.uid] = user;
        return true;
    }

    retrieve(uniqueID) {
        const user = this.__virtualDB__[uniqueID];
        return (user != null) ? users.create(user.username, user.name, user.dateCreated) : user;
    }

    retrieveAll() {
        return Object.values(this.__virtualDB__)
            .map(user => users.create(user.username, user.name, user.dateCreated));
    }

    remove(uniqueID) {
        if (this.__virtualDB__[uniqueID] == null) return false;
        
        delete this.__virtualDB__[uniqueID];
        return true;
    }

    contains(uniqueID) {
        return this.__virtualDB__[uniqueID] != null;
    }
}

class UniqueIDObjSaver {
    
    constructor() {
        this.__virtualDB__ = {}
        this.__nextUniqueID__ = 1;
    }

    save(uniqueIDObj) {
        this.__virtualDB__[uniqueIDObj.uid] = uniqueIDObj;
        return true;
    }

    retrieve(uniqueID) {
        return this.__virtualDB__[uniqueID];
    }

    retrieveAll() {
        return Object.values(this.__virtualDB__);
    }

    remove(uniqueID) {
        if (this.__virtualDB__[uniqueID] == null) return false;
        delete this.__virtualDB__[uniqueID];
        return true;
    }

    contains(uniqueID) {
        return this.__virtualDB__[uniqueID] != null;
    }

    nextUniqueID() {
        return this.__nextUniqueID__++;
    }
}

const virtualUserDB = new VirtualUserDB();
const virtualTaskListDB = new UniqueIDObjSaver();
const virtualListTableDB = new UniqueIDObjSaver();
module.exports = { 
    user: virtualUserDB,
    taskList: virtualTaskListDB,
    listTable: virtualListTableDB,
};