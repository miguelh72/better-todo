"use strict";

class Task {
  constructor(content, date) {
    this.__content__ = content || "";
    this.__dateCreated__ = date || new Date();
  }
  
  getContent() { 
    return this.__content__;
  }
  
  getDateCreated() {
    return this.__dateCreated__;
  }
}

class TaskList {
  constructor() {
    this.__tasks__ = [];
  }
  
  getTasks() {
    return [...this.__tasks__];
  }
  
  add(task) {
    this.__validateTask__(task);
    this.__tasks__.push(task);
    return this;
  }
  
  remove(task) {
    this.__validateTask__(task);
    const index = this.__tasks__.findIndex(t => t === task);
    if (index > -1) {
      this.__tasks__.splice(index, 1);
    }
    return this;
  }
  
  __validateTask__(task) {
    if (!(task instanceof Task))
      throw new Error("Runtime Error: Attempted to add task that does not inherit from Task.");
  }
}

function create(content, date, options = {}) {
  return new Task(content, date);
}

function createList() {
  return new TaskList();
}

/**function giveUpdateTime(obj, date) {
  Object.assign(obj, {
    dateUpdated: new Date(),
  });
}*/

module.exports = { create, createList };