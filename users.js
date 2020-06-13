"use strict";

const validate = require("./validation.js");

// TODO replace with persistent unique ID issuing system
let lastID = 0;
function nextAvailableID() {
    lastID++;
    return lastID;
}

class User {
    constructor({ 
        id: userID = nextAvailableID(), 
        dateCreated = new Date(), 
        username = null, 
        name = "Guest" } = {}
    ){
        validate.userID(userID);
        validate.date(dateCreated);
        if (username != null) validate.username(username);
        validate.name(name);
        
        this.__id__ = userID;
        this.__dateCreated__ = dateCreated;
        this.__username__ = username;
        this.__name__ = name;
    }
    
    get id() { return this.__id__; }
    set id(_) { throw new Error("Assignment Error: user ID is not updatable.") }
    
    get name() { return this.__name__; }
    set name(name) {
        validate.name(name);

        this.__name__ = name;
    }
    
    get dateCreated() { return this.__dateCreated__; }
    set dateCreated(_) { throw new Error("Assignment Error: user dateCreated is not updatable.") }

    get username() { return this.__username__; }
    set username(_) { throw new Error("Assignment Error: username is not updatable.") }

}

function create(userID, username, name, dateCreated) {
    return new User({
        userID,
        username,
        name,
        dateCreated,
    });
}
module.exports = { create };
