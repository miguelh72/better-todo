const tasks = require("./tasks.js");

/** Tasks */

test("Create task with default values", () => {
  const task = tasks.create();
  expect(task).toBeTruthy();
  expect(task.getDescription()).toBe("");
  expect(task.getDateCreated() instanceof Date).toBe(true);
});

/**
test("Create task with defined values", () => {
  const desc = "Clean and refactor code.";
  const date = new Date();
  const task = tasks.create(desc, date);
  expect(task.getDescription()).toBe(desc);
  expect(task.getDateCreated()).toBe(date);
});

test("Update task content", () => {
  const content = "Clean code.";
  const updatedContent = "Clean and refactor code.";
  const date = new Date();
  const updateDate = new Date();
  
  const task = tasks.create(content, date);
  expect(task.getDateUpdated()).toBe(date);
  task.setDescription(updatedContent, updateDate);
  expect(task.getDescription()).toBe(updatedContent);
  expect(task.getDateUpdated()).toBe(updateDate);
});

/** Task list */

// TODO test taskList description

/**
test("Create list of tasks", () => {
  const taskList = tasks.createList();
  expect(taskList).toBeTruthy();
  expect(taskList.getList()).toEqual([]);
});

test("Add and retrieve tasks from task list", () => {
  const taskList = tasks.createList();
  const task1 = tasks.create();
  const task2 = tasks.create();
  taskList.add(task1);
  taskList.add(task2);
  expect(taskList.getList()).toEqual([task1, task2]);
});

test("Remove tasks from task list", () => {
const taskList = tasks.createList();
  const task1 = tasks.create();
  const task2 = tasks.create();
  taskList.add(task1);
  taskList.add(task2);
  
  taskList.remove(task1);
  expect(taskList.getList()).toEqual([task2]);
  taskList.remove(task2);
  expect(taskList.getList()).toEqual([]);
  taskList.remove(task1);
  expect(taskList.getList()).toEqual([]);
});
*/