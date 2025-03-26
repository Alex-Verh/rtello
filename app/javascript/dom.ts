const getAssetUrl = (imageName: string) => {
  return `/assets/${imageName}`;
};

// TODO CHANGE LIST_ID TO POSITION
export const listHTML = (
  id: number,
  name: string,
  position: number
): HTMLElement => {
  const wrapper = document.createElement("div");
  wrapper.className = "dashboard__list flex-shrink-0 flex flex-col cursor-grab";
  wrapper.dataset.listPosition = position.toString();
  wrapper.id = `list${id}`;

  wrapper.innerHTML = `
        <div class="dashboard__list__header flex items-center justify-between">
            <div class="dashboard__list__title">${name}</div>
            <button class="dashboard__list__delete"  data-list-id="${id}">
                <img src="${getAssetUrl(
                  "trash.svg"
                )}" alt="Delete" class="cursor-pointer dashboard__list__icon">
            </button>
        </div>
        
        <div class="dashboard__list__tasks overflow-y-scroll" data-list_id="${position}"></div>
        <div class="dashboard__list__add flex items-center" data-list-id="${id}">
            <img src="${getAssetUrl(
              "plus.svg"
            )}" alt="Add" class="cursor-pointer dashboard__list__icon">
            <button class="cursor-pointer">Add new task</button>
        </div>
    `;

  return wrapper;
};

export const taskHTML = (
  id: number,
  description: string,
  position: number,
  isDashbord: boolean
): HTMLElement => {
  const wrapper = document.createElement("div");
  wrapper.className = "dashboard__task flex items-center cursor-grab";
  wrapper.dataset.taskPosition = position.toString();
  wrapper.id = `task${id}`;

  wrapper.innerHTML = `
      ${
        isDashbord
          ? '<button class="dashboard__task__complete cursor-pointer"></button>'
          : ""
      }
      <span>${description}</span>
      <button class="dashboard__task__delete" data-task-id="${id}">
        <img src="${getAssetUrl(
          "cross.svg"
        )}" alt="Delete" class="cursor-pointer dashboard__task__icon">
      </button>
    `;

  return wrapper;
};
