# better-todo

# Overview
Todo lists are traditionally an unordered colection of tasks. 

Improvement on this structure include changing to an ordered list encoding priority, tagging elements with priority or subject qualifiers, and/or adding date metadata to overall list or each element to signify due date or provide cognition of time in list, as an indirect measure of priority.

## Functionality Features
Fundamentally these strategies aim to provide the following features that a modern todo list should include:
 * store tasks with content and metadata
 * store multiple sets of tasks
 * declare priority for tasks
   * ?relative, absolute, both?
 * declare task and task set category
 * store creation date and time
   * allow explicit change of reporting timezone—default to user timezone
 * declare due date
 * provide clean and intuitive way to add tasks
   * require content
   * optional due date
   * optional priority
   * optional category
   * optional parent set—default set
   * intelligently suggest most likely optional category
 * provide clean and intuitive way to update tasks
   * update content
   * update due date
   * update priority
   * update category
   * update parent set
 * provide multiple views of task set that focus on a different feature in a way that adds perspective and value:
   * quadrant view
   * chronological view, by creation or due date
   * archive view
     * date range selection
     * same views as for open tasks

# API and Security Features
The following distribution and security features should be included:
 * public API to power application and allow custom clients
 * account on demand system, stores account identifier and secret encryption key
   * secret key is sent only once, at account creation
   * ?there is no recovery option?
   * encryption algorithm agnostic business logic—allow user to decide among encryption strategies
 * public list of what is considered and handled as personal identifiable informatipn (PPI)
 * all PPI is encrypted when returned from API