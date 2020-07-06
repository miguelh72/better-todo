"use strict";

const { Task } = require("../data_models");

test("Create task with default values", () => {
  const task = new Task();
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
  
  const task = new Task(desc, dateCreated, dueDate, true, true);
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
  const task = new Task(content, date);
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
