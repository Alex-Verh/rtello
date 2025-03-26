import Sortable from "sortablejs";
import { reorderLists } from "../api/lists";
import { reorderTasks } from "../api/tasks";

export const enableSortable = () => {
  const listsContainer = document.getElementById("lists-container");
  if (listsContainer) {
    const containerId = (listsContainer.dataset.dashboardId ||
      listsContainer.dataset.templateId) as string;

    new Sortable(listsContainer, {
      animation: 150,
      ghostClass: "sortable-ghost",
      draggable: ".dashboard__list",
      onEnd: () => {
        // get the new order of lists
        const listArray = Array.from(
          document.querySelectorAll(".dashboard__list")
        ).map((l, index) => {
          const list = l as HTMLElement;
          return {
            id: list.dataset?.listId as string,
            position: index as number,
            container_id: containerId,
          };
        });
        // sent the array of lists for update
        reorderLists(listArray);
      },
    });
  }

  // Enable sorting within each list & allow moving tasks between lists
  document.querySelectorAll(".dashboard__list__tasks").forEach((taskList) => {
    new Sortable(taskList as HTMLElement, {
      group: "tasks",
      animation: 150,
      ghostClass: "sortable-ghost",
      draggable: ".dashboard__task",
      onEnd: () => {
        // update task order
        updateTaskOrder();
      },
    });
  });
};

function updateTaskOrder() {
  const lists = document.querySelectorAll(".dashboard__list__tasks");
  const taskData: any[] = [];

  lists.forEach((list) => {
    const listId = list.getAttribute("data-list-id");
    // iterate per each list its tasks
    Array.from(list.children).forEach((task, index) => {
      taskData.push({
        id: task.getAttribute("data-task-id"),
        list_id: listId,
        position: index,
      });
    });
  });
  // send the array of tasks for update
  reorderTasks(taskData);
}
