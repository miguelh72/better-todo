"use strict";

const users = require("./users.js");
const persistence = require("./persistence.js");

/**
 * Asynchronously create new User object in storage.
 * @param {string} username 
 * @param {string} name 
 * @param {Date} dateCreated 
 * @returns {Promise<User>} User object
 */
async function asyncNewUser(username, name, dateCreated) {
    const newUser = users.create(username, name, dateCreated);
    await persistence.asyncCreateUser(newUser);
    return newUser;
}

/**
 * Asynchronously fetch/read User object from storage.
 * @param {string} username 
 * @returns {Promise<User>} User object or false if missing resource in storage.
 */
async function asyncRetrieveUser(username) {
    try {
        const user =  await persistence.asyncReadUser(username);
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
    return await persistence.asyncDeleteUser(user.uid);
}

module.exports = { 
    asyncNewUser,
    asyncRetrieveUser,
    asyncUpdateUser,
    asyncDeleteUser,
};