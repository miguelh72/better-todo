const tasks = require("./tasks.js");

/** Tasks */

// TODO create validation module and validation tests

test("Create task with default values", () => {
  const task = tasks.create();
  expect(task).toBeTruthy();
  expect(task.description).toBe("");
  expect(task.dateCreated instanceof Date).toBe(true);
  expect(task.dateUpdated instanceof Date).toBe(true);
  expect(task.important).toBe(false);
  expect(task.urgent).toBe(false);
  expect(task.dueDate).toBe(null);
  expect(task.completed).toBe(false);
  expect(task.archived).toBe(false);
});

test("Create task with defined values", () => {
  const desc = "Clean and refactor code.";
  const dateCreated = new Date("03/19/2000");
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 1);
  
  const task = tasks.create(desc, dateCreated, dueDate, true, true);
  expect(task.description).toBe(desc);
  expect(task.dateCreated).toBe(dateCreated);
  expect(task.dateUpdated).toBe(dateCreated);
  expect(task.dueDate).toBe(dueDate);
  expect(task.important).toBe(true);
  expect(task.urgent).toBe(true);
  expect(task.completed).toBe(false);
  expect(task.archived).toBe(false);
});

test("Update task content", () => {
  const content = "Clean code.";
  const updatedContent = "Clean and refactor code.";
  const date = new Date();
  const updateDate = new Date();
  const task = tasks.create(content, date);
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 1);
  
  expect(task.dateUpdated).toBe(date);
  
  task.description = updatedContent;
  task.dateUpdated = updateDate;
  task.dueDate = dueDate;
  task.urgent = true;
  task.important = true;
  task.completed = true;
  task.archived = true;
  
  expect(task.description).toBe(updatedContent);
  expect(task.dateUpdated).toBe(updateDate);
  expect(() => task.dateCreated = new Date()).toThrow();
  expect(task.dueDate).toBe(dueDate);
  expect(task.important).toBe(true);
  expect(task.urgent).toBe(true);
  expect(task.completed).toBe(true);
  expect(task.archived).toBe(true);
});

/** Task list */

test("Create list of tasks with default values", () => {
  const taskList = tasks.createList();
  
  expect(taskList).toBeTruthy();
  expect(taskList.toArray()).toEqual([]);
  expect(taskList.description).toBe("");
  expect(taskList.name).toBe("Unnamed");
  expect(taskList.completed).toBe(true); // no tasks is a completed list
  expect(taskList.archived).toBe(false);
});

test("Add and retrieve tasks from task list", () => {
  const taskList = tasks.createList();
  const task1 = tasks.create();
  const task2 = tasks.create();
  taskList.add(task1);
  taskList.add(task2);
  
  expect(taskList.toArray()).toEqual([task1, task2]);
  expect(taskList.completed).toBe(false);
  expect(taskList.archived).toBe(false);
});

test("Remove tasks from task list", () => {
  const taskList = tasks.createList();
  const task1 = tasks.create();
  const task2 = tasks.create();
  taskList.add(task1);
  taskList.add(task2);
  
  taskList.remove(task1);
  expect(taskList.toArray()).toEqual([task2]);
  taskList.remove(task2);
  expect(taskList.toArray()).toEqual([]);
  taskList.remove(task1);
  expect(taskList.toArray()).toEqual([]);
  expect(taskList.completed).toBe(true);
  expect(taskList.archived).toBe(false);
});

test("Create with and try to update task list unique ID.", () => {
  const listUID = 79454;
  
  const taskList = tasks.createList(listUID);
  expect(taskList.uid).toEqual(listUID);
  expect(() => taskList.uid = 1).toThrow();
});

test("Create with and update task list name.", () => {
  const listName = "My tasklist of importance";
  const updatedListName = "My graveyard of uncompleted tasks";
  
  const taskList = tasks.createList(undefined, listName);
  expect(taskList.name).toEqual(listName);
  taskList.name = updatedListName;
  expect(taskList.name).toEqual(updatedListName);
});

test("Create with and update task list description.", () => {
  const listDescription = "This is a list's description.";
  const updatedListDesc = "Updated description";
  
  const taskList = tasks.createList(undefined, undefined, listDescription);
  expect(taskList.description).toEqual(listDescription);
  taskList.description = updatedListDesc;
  expect(taskList.description).toEqual(updatedListDesc);
});

test("Completing and archiving task list.", () => {
    const taskList = tasks.createList();
    const task1 = tasks.create();
    const task2 = tasks.create();
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