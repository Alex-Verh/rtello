import "../../assets/stylesheets/home.scss";
import { createTemplate } from "../api/templates";
import axios from "axios";
import { openModal } from "../functions/modal";

document.addEventListener("turbo:load", () => {
  const csrfToken = document
    .querySelector('meta[name="csrf-token"]')
    ?.getAttribute("content");

  if (csrfToken) {
    axios.defaults.headers.common["X-CSRF-Token"] = csrfToken;
  }

  // create template
  const createBtn = document.querySelector("#create-template") as HTMLElement;
  if (createBtn) {
    createBtn.addEventListener("click", () => {
      openModal(
        "Create New Template",
        "Template Name",
        "name",
        "Create",
        async (name) => {
          const data = await createTemplate(name);
        }
      );
    });
  }
});
