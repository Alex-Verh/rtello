import "../../assets/stylesheets/dashboard.scss";
import { enableModal, enableSidebar } from "../functions/modal";
import { enableSortable } from "../functions/sort";

document.addEventListener("turbo:load", () => {
  enableModal("create-list");
  enableSidebar();
  enableSortable();

  // create list button
  const form = document.getElementById("list-form") as HTMLFormElement;
  if (form == null) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const name = formData.get("name") as string;
  });
});
