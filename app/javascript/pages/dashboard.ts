import "../../assets/stylesheets/dashboard.scss";
import { enableSidebar, openModal } from "../functions/modal";
import { enableSortable } from "../functions/sort";
import { createList, updateList, deleteList } from "../api/lists";
import {
  deleteDashboard,
  updateDashboard,
  createDashboardFromTemplate,
} from "../api/dashboards";
import { deleteTemplate, updateTemplate } from "../api/templates";
import {
  createTask,
  deleteTask,
  updateTask,
  updateTaskState,
} from "../api/tasks";
import { listHTML, taskHTML } from "../dom";
import { ListResponse, TaskResponse } from "../interfaces";
import axios from "axios";

document.addEventListener("turbo:load", () => {
  const csrfToken = document
    .querySelector('meta[name="csrf-token"]')
    ?.getAttribute("content");

  if (csrfToken) {
    axios.defaults.headers.common["X-CSRF-Token"] = csrfToken;
  }

  enableSidebar();
  enableSortable(); // enable sorting of lists and tasks

  const container = document.querySelector("#lists-container") as HTMLElement;
  if (!container) return;

  const dashboardId = container.dataset?.dashboardId as string;
  const templateId = container.dataset?.templateId as string;

  console.log(dashboardId);
  console.log(templateId);

  const containerId = (dashboardId || templateId) as string;

  // delete container button
  const deleteBtn = document.querySelector("#delete-container") as HTMLElement;
  if (deleteBtn) {
    deleteBtn.addEventListener("click", () => {
      if (dashboardId) deleteDashboard(dashboardId);
      if (templateId) deleteTemplate(templateId);
    });
  }

  // change container name
  const renameBtn = document.querySelector("#rename-container") as HTMLElement;
  if (renameBtn) {
    renameBtn.addEventListener("click", () => {
      openModal(
        "Change Name",
        "Workspace Name",
        "name",
        "Change",
        (newName) => {
          if (dashboardId) updateDashboard(dashboardId, newName);
          if (templateId) updateTemplate(templateId, newName);
        }
      );
    });
  }

  // create dashboard from template
  const createFrom = document.querySelector("#create-from") as HTMLElement;
  if (createFrom) {
    createFrom.addEventListener("click", () => {
      openModal(
        "Indicate Dashboard Name",
        "Dashboard Name",
        "name",
        "Create",
        (name) => {
          if (templateId) createDashboardFromTemplate(templateId, name);
        }
      );
    });
  }

  // create list
  const createBtn = document.querySelector("#create-list") as HTMLElement;
  if (createBtn) {
    createBtn.addEventListener("click", () => {
      openModal(
        "Create New List",
        "List Name",
        "name",
        "Create List",
        async (name) => {
          const data = (await createList(containerId, name)) as ListResponse;
          if (!data) return;

          const addButton = container.querySelector("#create-list");
          container.insertBefore(
            listHTML(data.id, data.name, data.position),
            addButton
          );
        }
      );
    });
  }

  container.addEventListener("dblclick", (e: Event) => {
    // change list name
    const listName = (e.target as HTMLElement)?.closest(
      ".dashboard__list__title"
    ) as HTMLElement;

    if (listName) {
      const listId = listName.dataset.listId as string;
      openModal("Change Name", "List Name", "name", "Change", (newName) => {
        listName.textContent = newName;
        updateList(listId, newName);
      });
    }

    // change task description
    const taskDescription = (e.target as HTMLElement)?.closest(
      ".dashboard__task__description"
    ) as HTMLElement;

    if (taskDescription) {
      const taskId = taskDescription.dataset.taskId as string;
      openModal(
        "Change Task",
        "Task Description",
        "description",
        "Change",
        (newDescription) => {
          taskDescription.textContent = newDescription;
          updateTask(taskId, newDescription);
        }
      );
    }
  });

  container.addEventListener("click", (e: Event) => {
    // delete list
    const listDelete = (e.target as HTMLElement)?.closest(
      ".dashboard__list__delete"
    ) as HTMLElement;

    if (listDelete) {
      const listId = listDelete.dataset.listId as string;
      if (listId) {
        const listElem = container.querySelector(
          `#list${listId}`
        ) as HTMLElement;
        deleteList(listId);
        listElem.remove();
      }
    }

    // create task
    const taskBtn = (e.target as HTMLElement)?.closest(
      ".dashboard__list .dashboard__list__add"
    ) as HTMLElement;

    if (taskBtn) {
      const listId = taskBtn.dataset.listId as string;
      const listTasks = container.querySelector(
        `#list-tasks${listId}`
      ) as HTMLElement;
      openModal(
        "Create New Task",
        "Task Name",
        "description",
        "Create Task",
        async (description) => {
          const data = (await createTask(listId, description)) as TaskResponse;
          if (!data) return;

          listTasks.insertAdjacentElement(
            "beforeend",
            taskHTML(
              data.id,
              data.description,
              data.position,
              dashboardId != null
            )
          );
        }
      );
    }

    // toggle task state
    const taskState = (e.target as HTMLElement)?.closest(
      ".dashboard__task__complete"
    ) as HTMLElement;

    if (taskState) {
      const taskId = taskState.dataset.taskId as string;
      if (taskId) {
        const taskElem = container.querySelector(
          `#task${taskId}`
        ) as HTMLElement;
        updateTaskState(taskId);
        taskElem.classList.toggle("dashboard__task_active");
      }
    }

    // delete task
    const taskDelete = (e.target as HTMLElement)?.closest(
      ".dashboard__task__delete"
    ) as HTMLElement;

    if (taskDelete) {
      const taskId = taskDelete.dataset.taskId as string;
      if (taskId) {
        const taskElem = container.querySelector(
          `#task${taskId}`
        ) as HTMLElement;
        deleteTask(taskId);
        taskElem.remove();
      }
    }
  });
});
