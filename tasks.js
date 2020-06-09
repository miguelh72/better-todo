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

class Test {
  show() { return "something" }
}
const TestUpdatable = class extends UpdatableMixin(Test) {};
let a = new TestUpdatable();
console.log({TestUpdatable});

function UpdatableMixin(superclass) {
  return class extends superclass {
    constructor(...args) {
      super(...args);
      for (let prop of Object
.getOwnPropertyNames(superclass.prototype))     {
        if (prop === "constructor") continue;
        this[prop] = (...args) => {
          console.log("additional functionality dynamically added")
          return super[prop](...args);
        }
      }
      /**const baseObject = Object.getPrototypeOf(new Object());
      let prototype = Object.getPrototypeOf(this);
      while (prototype !== baseObject) {
        for (let prop of Object.getOwnPropertyNames(prototype)) {
          if (prop !== "constructor") {
            // Wrap method around call to update method
            super[prop] = function(...args) {
              // TODO either check if keywords such as set, add, update are in prop name and update then, or refactor 
              //so other mixins use this update mixin first.
            }
          }
        }
        prototype = Object.getPrototypeOf(prototype);
      }
      */
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
  UpdatableMixin(
  DescriptionMixin(
  DateCreatedMixin(
  Object))) {}

class TaskList extends 
  DescriptionMixin(
  ListContainer) {}

function create(description, dateCreated) {
  return new Task(description, dateCreated);
}
function createList(description) {
  return new TaskList(description, task => task instanceof Task);
}
//module.exports = { create, createList };