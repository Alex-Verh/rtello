import { Application } from "@hotwired/stimulus";
import { enablePopup, openModal } from "../functions/modal";
import { createDashboard } from "../api/dashboards";
import axios from "axios";

const application = Application.start();
application.debug = false;
window.Stimulus = application;

document.addEventListener("turbo:load", () => {
  const isAuthenticated =
    document
      .querySelector('meta[name="current-user"]')
      ?.getAttribute("content") === "true";

  const csrfToken = document
    .querySelector('meta[name="csrf-token"]')
    ?.getAttribute("content");

  if (csrfToken) {
    axios.defaults.headers.common["X-CSRF-Token"] = csrfToken;
  }

  if (isAuthenticated) {
    enablePopup("see-dashboards"); // navbar popup
    enablePopup("see-recents"); // navbar popup
    enablePopup("see-templates"); // navbar popup

    // create dashboard
    const createBtn = document.querySelector(
      "#create-dashboard"
    ) as HTMLElement;
    if (createBtn) {
      createBtn.addEventListener("click", () => {
        openModal(
          "Create Blank Dashboard",
          "Dashboard Name",
          "name",
          "Create",
          async (name) => {
            const data = await createDashboard(name);
          }
        );
      });
    }
  }

  enablePopup("seeAccount"); // navbar popup
});

export { application };
