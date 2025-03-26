import { Application } from "@hotwired/stimulus";
import { enableModal } from "../functions/modal";
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
    enableModal("create-dashboard"); // modal
    enableModal("see-dashboards", true); // navbar popup
    enableModal("see-recents", true); // navbar popup
    enableModal("see-templates", true); // navbar popup

    // create dashboard button
    const form = document.getElementById("dashboard-form") as HTMLFormElement;
    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const formData = new FormData(form);
      const name = formData.get("name") as string;
      createDashboard(name);
    });
  }

  enableModal("seeAccount", true); // navbar popup
});

export { application };
