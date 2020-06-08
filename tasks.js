"use strict";

function DateCreatedMixin(superclass) {
  return class extends superclass {
    
    constructor(date = new Date(), ...other) {
      super(...other);
      this.__dateCreated__ = date;
    }
    
    getDateCreated() {
      return this.__dateCreated__;
    }
    
  }
}

function DescriptionMixin(superclass) {
  return class extends superclass {
    
    constructor(description = "", ...other) {
      super(...other);
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

class ListContainer {
  
  constructor(itemValidator = () => true) {
    this.__list__ = [];
    this.__isValid__ = itemValidator;
  }
  
  getList() {
    return [...this.__list__];
  }
  
  add(item) {
    if (this.__isValid__(item)) {
      this.__list__.push(item);
      return true;
    } else {
      return false;
    }
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

class Task extends DescriptionMixin(DateCreatedMixin(Object)) {}

class TaskList extends DescriptionMixin(ListContainer) {}

function create(content, date, options = {}) {
  return new Task(content, date);
}

function createList() {
  return new TaskList();
}

module.exports = { create, createList };