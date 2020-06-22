"use strit";

const FORCE_SEND = false;

function testingWithJest() {
    return process.env.JEST_WORKER_ID !== undefined;
}

async function send(message) {
    if (FORCE_SEND || !testingWithJest()) console.trace(message);
}

module.exports = { send };