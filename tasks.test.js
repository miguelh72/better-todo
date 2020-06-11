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
  
  const task = tasks.create(desc, dateCreated, dateUpdated, dueDate, true, true);
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
  expect(task.dateUpdated).toBe(date);
  task.description = updatedContent;
  task.dateUpdated = updateDate;
  expect(task.description).toBe(updatedContent);
  expect(task.dateUpdated).toBe(updateDate);
  expect(() => task.dateCreated = new Date()).toThrow();
});

/** Task list */

test("Create list of tasks", () => {
  const taskList = tasks.createList();
  expect(taskList).toBeTruthy();
  expect(taskList.toArray()).toEqual([]);
});

test("Add and retrieve tasks from task list", () => {
  const taskList = tasks.createList();
  const task1 = tasks.create();
  const task2 = tasks.create();
  taskList.add(task1);
  taskList.add(task2);
  expect(taskList.toArray()).toEqual([task1, task2]);
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
});

test("Task list description.", () => {
  const listDescription = "This is a list's description.";
  const updatedListDesc = "Updated description";
  
  const taskList = tasks.createList(listDescription);
  expect(taskList.description).toEqual(listDescription);
  taskList.description = updatedListDesc;
  expect(taskList.description).toEqual(updatedListDesc);
});