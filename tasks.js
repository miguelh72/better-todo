"use strict";

function DateCreatedMixin(superclass) {
  return class extends superclass {
    
    constructor(date = new Date(), ...otherArgs) {
      super(...otherArgs);
      this.__dateCreated__ = date;
    }
    
    getDateCreated() {
      return this.__dateCreated__;
    }
    
  }
}

function DescriptionMixin(superclass) {
  return class extends superclass {
    
    constructor(description = "", ...otherArgs) {
      super(...otherArgs);
      this.__description__ = description;
    }
    
    getDescription() {
     return this.__description__;
    }
    
    setDescription(description) {
      if (description == null) return false;
      this.__description__ = description;
    }
    
  }
}

function UpdatableMixin(superclass) {
  return class extends superclass {
    constructor(...args) {
      super(...args);
      const propNames = Object.getOwnPropertyNames(this);
      console.log(propNames); // RM
    }
  }
}

class ListContainer {
  
  constructor(itemValidator = () => true) {
    this.__list__ = [];
    this.__isValid__ = itemValidator;
  }
  
  getList() {
    return [...this.__list__];
  }
  
  add(item) {
    if (!this.__isValid__(item)) 
      return false;
    
    this._list__.push(item);
    return true;
  }
  
  remove(item) {
    if (!this.__isValid__(item)) 
      return false;
    
    const index = this.__list__.findIndex(i => i === item);
    if (index > -1) {
      this.__list__.splice(index, 1);
      return true;
    }
    return false;
  }
}

class Task extends 
  DescriptionMixin(
  DateCreatedMixin(
  UpdatableMixin(
  Object))) {}

class TaskList extends 
  DescriptionMixin(
  ListContainer) {}

function create(description, dateCreated) {
  return new Task(description, dateCreated);
}
function createList(description) {
  return new TaskList(description);
}
module.exports = { create, createList };