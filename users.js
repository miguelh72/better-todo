"use strict";

// TODO replace with persistent ID issuing sustem
let lastID = 0;
function nextAvailableID() {
    lastID++;
    return lastID;
}

class User {
    constructor(dateCreated = new Date(), username = null, name = "Guest") {
        this.__id__ = nextAvailableID();
        this.__dateCreated__ = dateCreated;
        this.__username__ = username;
        this.__name__ = name;
    }
    
    get id() { return this.__id__; }
    // TODO prevent setting
    
    get name() { return this.__name__; }
    
    get dateCreated() { return this.__dateCreated__; }
    
    get username() { return this.__username__; }
}

function create() {
    return new User();
}
module.exports = { create };
