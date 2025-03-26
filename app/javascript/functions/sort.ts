import Sortable, { MoveEvent } from "sortablejs";

export const enableSortable = () => {
  const listsContainer = document.getElementById("lists-container");
  if (listsContainer) {
    new Sortable(listsContainer, {
      animation: 150,
      ghostClass: "sortable-ghost",
      draggable: ".dashboard__list",
      onEnd: (evt: MoveEvent) => {
        console.log("List moved:", evt.oldIndex, "→", evt.newIndex);
        // update list order
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
      onEnd: (evt: MoveEvent) => {
        console.log("Task moved:", evt.oldIndex, "→", evt.newIndex);
        console.log(
          "From List:",
          evt.from.dataset.listId,
          "To List:",
          evt.to.dataset.listId
        );
        // update task order
      },
    });
  });
};
