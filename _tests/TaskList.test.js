"use strict";

const { Task, TaskList } = require("../data_models");

test("Create list of tasks with default values", () => {
    const taskList = new TaskList(1);
    
    expect(taskList).toBeTruthy();
    expect(taskList.toArray()).toEqual([]);
    expect(taskList.description).toBe("");
    expect(taskList.name).toBe("Unnamed");
    expect(taskList.completed).toBe(true); // no tasks is a completed list
    expect(taskList.archived).toBe(false);
    expect(taskList.length).toBe(0);
  });
  
  test("Add and retrieve tasks from task list", () => {
    const taskList = new TaskList(1);
    const task1 = new Task();
    const task2 = new Task();
    taskList.add(task1);
    taskList.add(task2);
    
    expect(taskList.toArray()).toEqual([task1, task2]);
    expect(taskList.completed).toBe(false);
    expect(taskList.archived).toBe(false);
    expect(taskList.length).toBe(2);
  });
  
  test("Remove tasks from task list", () => {
    const taskList = new TaskList(1);
    const task1 = new Task();
    const task2 = new Task();
    taskList.add(task1);
    taskList.add(task2);
    
    taskList.remove(task1);
    expect(taskList.toArray()).toEqual([task2]);
    expect(taskList.length).toBe(1);
    taskList.remove(task2);
    expect(taskList.toArray()).toEqual([]);
    expect(taskList.length).toBe(0);
    taskList.remove(task1);
    expect(taskList.toArray()).toEqual([]);
    expect(taskList.completed).toBe(true);
    expect(taskList.archived).toBe(false);
  });
  
  test("Create with and try to update task list unique ID.", () => {
    const listUID = 79454;
    
    const taskList = new TaskList(listUID);
    expect(taskList.uid).toEqual(listUID);
    expect(() => taskList.uid = 1).toThrow();
  });
  
  test("Create with and update task list name.", () => {
    const listName = "My tasklist of importance";
    const updatedListName = "My graveyard of uncompleted tasks";
    
    const taskList = new TaskList(1, listName);
    expect(taskList.name).toEqual(listName);
    taskList.name = updatedListName;
    expect(taskList.name).toEqual(updatedListName);
  });
  
  test("Create with and update task list description.", () => {
    const listDescription = "This is a list's description.";
    const updatedListDesc = "Updated description";
    
    const taskList = new TaskList(1, undefined, listDescription);
    expect(taskList.description).toEqual(listDescription);
    taskList.description = updatedListDesc;
    expect(taskList.description).toEqual(updatedListDesc);
  });
  
  test("Completing and archiving task list.", () => {
      const taskList = new TaskList(1);
      const task1 = new Task();
      const task2 = new Task();
      taskList.add(task1);
      taskList.add(task2);
      
      taskList.completed = true;
      taskList.archived = true;
      
      expect(taskList.completed).toBe(true);
      expect(taskList.archived).toBe(true);
      expect(task1.completed).toBe(true);
      expect(task1.archived).toBe(true);
      expect(task2.completed).toBe(true);
      expect(task2.archived).toBe(true);
      
      task1.completed = false;
      expect(taskList.completed).toBe(false);
      
      taskList.archived = false;
      expect(taskList.archived).toBe(false);
  });