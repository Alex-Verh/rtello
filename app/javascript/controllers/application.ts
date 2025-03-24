import { Application } from "@hotwired/stimulus";
import { enableModal } from "../functions/modal";

const application = Application.start();
application.debug = false;
window.Stimulus = application;

document.addEventListener("turbo:load", () => {
  const isAuthenticated =
    document
      .querySelector('meta[name="current-user"]')
      ?.getAttribute("content") === "true";

  if (isAuthenticated) {
    enableModal("createDashboard"); // modal
    enableModal("seeDashboards", true); // navbar popup
    enableModal("seeRecents", true); // navbar popup
    enableModal("seeTemplates", true); // navbar popup
  }

  enableModal("seeAccount", true); // navbar popup
});

export { application };
