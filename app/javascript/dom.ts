const getAssetUrl = (imageName: string) => {
  return `/assets/${imageName}`;
};

export const listHTML = (name: string, position: number): HTMLElement => {
  const wrapper = document.createElement("div");
  wrapper.className = "dashboard__list flex-shrink-0 flex flex-col cursor-grab";
  wrapper.dataset.list_id = position.toString();

  wrapper.innerHTML = `
        <div class="dashboard__list__header flex items-center justify-between">
            <div class="dashboard__list__title">${name}</div>
            <button>
                <img src="${getAssetUrl(
                  "trash.svg"
                )}" alt="Delete" class="cursor-pointer dashboard__list__icon">
            </button>
        </div>
        
        <div class="dashboard__list__tasks overflow-y-scroll" data-list_id="${position}"></div>
        <div class="dashboard__list__add flex items-center">
            <img src="${getAssetUrl(
              "plus.svg"
            )}" alt="Add" class="cursor-pointer dashboard__list__icon">
            <button class="cursor-pointer">Add new task</button>
        </div>
    `;

  return wrapper;
};
