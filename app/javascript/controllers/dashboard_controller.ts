import "../../assets/stylesheets/dashboard.scss";
import { enableSidebar, openModal } from "../functions/modal";
import { enableSortable } from "../functions/sort";
import { createList, updateList, deleteList } from "../api/lists";
import {
  deleteDashboard,
  updateDashboard,
  createDashboardFromTemplate,
  addDashboardMember,
  removeDashboardMember,
} from "../api/dashboards";
import { deleteTemplate, updateTemplate } from "../api/templates";
import {
  createTask,
  deleteTask,
  updateTask,
  updateTaskState,
} from "../api/tasks";
import { listHTML, taskHTML, memberHTML } from "../dom";
import { ListResponse, TaskResponse, MemberResponse } from "../interfaces";
import axios from "axios";
import { Controller } from "@hotwired/stimulus";

export default class DashboardController extends Controller {
  connect() {
    const csrfToken = this.getCsrfToken();

    if (csrfToken) {
      axios.defaults.headers.common["X-CSRF-Token"] = csrfToken;
    }

    enableSidebar();
    enableSortable();

    const container = document.querySelector("#lists-container") as HTMLElement;
    if (!container) return;

    const sidebar = document.querySelector("#sidebar") as HTMLElement;
    if (!sidebar) return;

    const dashboardId = container.dataset?.dashboardId as string | null;
    const templateId = container.dataset?.templateId as string | null;
    const containerId = container.dataset?.containerId as string;

    this.handleDashboard(dashboardId, templateId);
    this.handleListCreate(containerId);
    this.handleDoubleClick();
    this.handleSingleClick(dashboardId);
    if (dashboardId) this.handleMember(dashboardId); // handle members only if dashboard
  }

  // get CSRF token
  getCsrfToken(): string | null | undefined {
    return document
      .querySelector('meta[name="csrf-token"]')
      ?.getAttribute("content");
  }

  // handle dashboards/templates actions
  private handleDashboard(
    dashboardId: string | null,
    templateId: string | null
  ) {
    // dashboards/templates delete
    const deleteContainer = document.querySelector(
      "#delete-container"
    ) as HTMLElement;
    deleteContainer?.addEventListener("click", () => {
      if (dashboardId) deleteDashboard(dashboardId);
      if (templateId) deleteTemplate(templateId);
    });

    // dashboards/templates rename
    const renameContainer = document.querySelector(
      "#rename-container"
    ) as HTMLElement;
    renameContainer?.addEventListener("click", () => {
      openModal(
        "Change Name",
        "Workspace Name",
        "name",
        "Change",
        async (newName: string) => {
          if (dashboardId) await updateDashboard(dashboardId, newName);
          if (templateId) await updateTemplate(templateId, newName);
          const containerName = document.querySelector(
            "#container-name"
          ) as HTMLElement;
          containerName.textContent = newName;
        }
      );
    });

    // create dashboard from this template
    const createFromTemplate = document.querySelector(
      "#create-from"
    ) as HTMLElement;
    createFromTemplate?.addEventListener("click", () => {
      openModal(
        "Indicate Dashboard Name",
        "Dashboard Name",
        "name",
        "Create",
        (name: string) => {
          if (templateId) createDashboardFromTemplate(templateId, name);
        }
      );
    });
  }

  handleListCreate(containerId: string) {
    // lists create
    const listCreate = document.querySelector("#create-list") as HTMLElement;
    listCreate.addEventListener("click", () => {
      openModal(
        "Create New List",
        "List Name",
        "name",
        "Create List",
        async (name: string) => {
          const data = (await createList(containerId, name)) as ListResponse;
          if (data) {
            const addButton = document.querySelector("#create-list");
            const container = document.querySelector(
              "#lists-container"
            ) as HTMLElement;
            container.insertBefore(
              listHTML(data.id, data.name, data.position),
              addButton
            );
          }
        }
      );
    });
  }

  // handle double clicks in the container
  private handleDoubleClick() {
    // create double click listener to rename list / taks
    document
      .querySelector("#lists-container")
      ?.addEventListener("dblclick", (e: Event) => {
        // if double click on list name
        const listName = (e.target as HTMLElement)?.closest(
          ".dashboard__list__title"
        ) as HTMLElement;
        if (listName) {
          const listId = listName.dataset.listId as string;
          openModal(
            "Change Name",
            "List Name",
            "name",
            "Change",
            (newName: string) => {
              listName.textContent = newName;
              updateList(listId, newName);
            }
          );
        }

        // if double click on task name
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
  }

  // handle single clicks in the container
  private handleSingleClick(dashboardId: string | null) {
    document
      .querySelector("#lists-container")
      ?.addEventListener("click", (e: Event) => {
        // delete list
        const listDelete = (e.target as HTMLElement)?.closest(
          ".dashboard__list__delete"
        ) as HTMLElement;

        if (listDelete) {
          const listId = listDelete.dataset.listId as string;
          if (listId) {
            const listElem = document.querySelector(`
                #list${listId}
              `) as HTMLElement;
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
          const listTasks = document.querySelector(
            `#list-tasks${listId}`
          ) as HTMLElement;
          openModal(
            "Create New Task",
            "Task Name",
            "description",
            "Create Task",
            async (description) => {
              const data = (await createTask(
                listId,
                description
              )) as TaskResponse;
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
          ".dashboard__list .dashboard__task__complete"
        ) as HTMLElement;

        if (taskState) {
          const taskId = taskState.dataset.taskId as string;
          if (taskId) {
            const taskElem = document.querySelector(
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
            const taskElem = document.querySelector(`
            #task${taskId}`) as HTMLElement;
            deleteTask(taskId);
            taskElem.remove();
          }
        }
      });
  }

  private handleMember(dashboardId: string) {
    // add member
    const addMember = document.querySelector("#add-member") as HTMLElement;
    if (addMember) {
      addMember.addEventListener("click", () => {
        openModal(
          "Add Member",
          "Email Address",
          "email",
          "Invite",
          async (name) => {
            const data = (await addDashboardMember(
              dashboardId,
              name
            )) as MemberResponse;
            if (!data) return;

            const memberContainer =
              document.querySelector("#members-container");
            memberContainer?.insertAdjacentElement(
              "afterend",
              memberHTML(data.id, data.full_name)
            );
          }
        );
      });
    }

    // add listener to sidebar if click on remove member
    document
      .querySelector("#sidebar")
      ?.addEventListener("click", (e: Event) => {
        const memberDelete = (e.target as HTMLElement)?.closest(
          ".sidebar__member__delete"
        ) as HTMLElement;
        if (memberDelete) {
          const memberId = memberDelete.dataset.memberId as string;
          if (memberId) {
            const memberElem = document.querySelector(
              `#member${memberId}`
            ) as HTMLElement;
            removeDashboardMember(dashboardId, memberId);
            memberElem.remove();
          }
        }
      });
  }
}
