import "../../assets/stylesheets/home.scss";
import { createTemplate } from "../api/templates";
import { enableModal } from "../functions/modal";
import axios from "axios";

document.addEventListener("turbo:load", () => {
  const csrfToken = document
    .querySelector('meta[name="csrf-token"]')
    ?.getAttribute("content");

  if (csrfToken) {
    axios.defaults.headers.common["X-CSRF-Token"] = csrfToken;
  }

  enableModal("create-template"); // template creation modal

  // create template button
  const form = document.getElementById("template-form") as HTMLFormElement;
  if (form == null) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const name = formData.get("name") as string;
    createTemplate(name);
  });
});
