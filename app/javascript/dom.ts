import { wrap } from "module";

const getAssetUrl = (imageName: string) => {
  return `/assets/${imageName}`;
};

export const listHTML = (
  id: number,
  name: string,
  position: number
): HTMLElement => {
  const wrapper = document.createElement("div");
  wrapper.className = "dashboard__list flex-shrink-0 flex flex-col cursor-grab";
  wrapper.dataset.listPosition = position.toString();
  wrapper.dataset.listId = id.toString();
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
        
        <div class="dashboard__list__tasks overflow-y-scroll" id="list-tasks${id}" data-list_id="${position}"></div>
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
  wrapper.dataset.taskId = id.toString();
  wrapper.id = `task${id}`;

  wrapper.innerHTML = `
      ${
        isDashbord
          ? `<button class="dashboard__task__complete cursor-pointer" data-task-id="${id}"></button>`
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

export const templateHTML = (id: number, name: string): HTMLElement => {
  const wrapper = document.createElement("a");

  wrapper.className =
    "home-main__dashboard flex items-center justify-center cursor-pointer";
  wrapper.href = `/template/${id}`;
  wrapper.innerHTML = `${name}`;
  wrapper.style = "background-color: #291b64;";

  return wrapper;
};

export const memberHTML = (id: number, name: string): HTMLElement => {
  const wrapper = document.createElement("div");

  wrapper.className = "sidebar__member flex items-center justify-between";
  wrapper.id = `member#${id}`;
  wrapper.innerHTML = `
  <div class="sidebar__member__account flex items-center cursor-pointer">
    <img src="${getAssetUrl(
      "account.svg"
    )}" alt="Account:" class="sidebar__member__icon">
    <span>${name}</span>
  </div>
  <button class="sidebar__member__delete" data-member-id="${id}">
    <img src="${getAssetUrl(
      "cross.svg"
    )}" alt="×" class="cursor-pointer sidebar__member__remove">
  </button>
  `;

  return wrapper;
};
