"use strict";

const validate = require("./validation.js");
const { date } = require("./validation.js");

// TODO replace with persistent ID issuing sustem
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
    // TODO prevent setting
    
    get name() { return this.__name__; }
    
    get dateCreated() { return this.__dateCreated__; }
    
    get username() { return this.__username__; }
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
