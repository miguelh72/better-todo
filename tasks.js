"use strict";

// TODO consider where validation should occur. Perhaps this should be at app boundary
class Validate {
  
  static date(input) {
    if (!(input instanceof Date)) throw new Error("Invalid Parameter: Date paramete must be of type Date.");
    return true;
  }
  
  static userDescription(input) {
    if (typeof input !== "string") throw new Error("Invalid Parameter: Description must be of type string.");
    return true;
  }
  
  static toggle(input) {
    if (typeof input === "boolean")
      throw new Error("Invalid Parameter: Toggle parameter must be boolean.");
    return true;
  }
  
  static task(input) {
    if (input.getDateCreated == null) throw new Error("Invalid Parameter: Task must implement DateCreated interface");
    if (input.getDescription == null) throw new Error("Invalid Parameter: Task must implement Description interface");
    if (input.getDateUpdated == null) throw new Error("Invalid Parameter: Task must implement Updatable interface.");
    return true;
    // TODO add urgency and importance interface.
  }
}

function DateCreatedMixin(superclass) {
  return class extends superclass {
    
    constructor(date = new Date(), ...otherArgs) {
      super(...otherArgs);
      Validate.date(date);
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
      Validate.userDescription(description);
      this.__description__ = description;
    }
    
    getDescription() {
     return this.__description__;
    }
    
    setDescription(description) {
      if (description == null) return false;
      Validate.userDescription(description);
      this.__description__ = description;
      return true;
    }
  }
}

function ImportanceMixin(superclass) {
  return class extends superclass {
    
    constructor(isImportant = false, ...otherArgs) {
      super(...otherArgs);
      Validate.toggle(isImportant);
      this.__isImportant__ = isImportant;
    }
    
    get important() { return this.__isImportant__; }
    set important(isImportant) {
      Validate.toggle(isImportant);
      this.__isImportant__ = isImportant;
    }
  }
}

//violates dependency inversion principle. Updatable depends on consumer's implementation details
class Updatable {
  
  constructor(date = new Date()) {
    Validate.date(date);
    this.__dateUpdated__ = date;
  }
  
  updated(date = new Date()) {
    Validate.date(date);
    this.__dateUpdated__ = date;
  }
  
  getDateUpdated() {
    return this.__dateUpdated__;
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
    
    this.__list__.push(item);
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
  Updatable)) {
    
    // Overriding violates dependency inversion principle. Updatable depends on consumers implementation details
    setDescription(description, dateUpdated) {
      const result = super.setDescription(description);
      if (result) this.updated(dateUpdated);
      return result;
    }
    
    
  }

class TaskList extends 
  DescriptionMixin(
  ListContainer) {}

function create(description, dateCreated) {
  return new Task(description, dateCreated, dateCreated);
}
function createList(description) {
  return new TaskList(description, Validate.task);
}
module.exports = { create, createList };