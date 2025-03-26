import "../../assets/stylesheets/dashboard.scss";
import { enableModal, enableSidebar } from "../functions/modal";
import { enableSortable } from "../functions/sort";
import { createList } from "../api/lists";
import { listHTML } from "../dom";
import { ListResponse } from "../interfaces";
import axios from "axios";

document.addEventListener("turbo:load", () => {
  const csrfToken = document
    .querySelector('meta[name="csrf-token"]')
    ?.getAttribute("content");

  if (csrfToken) {
    axios.defaults.headers.common["X-CSRF-Token"] = csrfToken;
  }

  enableModal("create-list");
  enableSidebar();
  enableSortable(); // enable sorting of lists and tasks

  const container = document.querySelector("#lists-container") as HTMLElement;
  if (container == null) return;

  const containerId = container.dataset?.dataContainerId;
  if (containerId == null) return;

  // create list button
  const form = container.querySelector("#list-form") as HTMLFormElement;
  if (form == null) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const name = formData.get("name") as string;
    const data = (await createList(containerId, name)) as ListResponse;

    if (!data) return;

    form.reset(); // reset form
    container.querySelector("#list-modal")?.classList.add("hidden"); // hide modal

    const addButton = container.querySelector("#create-list");

    container.insertBefore(listHTML(data.name, data.position), addButton);
  });
});
