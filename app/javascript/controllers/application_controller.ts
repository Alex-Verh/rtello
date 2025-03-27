import { enablePopup, openModal } from "../functions/modal";
import { createDashboard } from "../api/dashboards";
import axios from "axios";
import { Controller } from "@hotwired/stimulus";

export default class ApplicationController extends Controller {
  connect() {
    const isAuthenticated = this.isAuthenticated();
    const csrfToken = this.getCsrfToken();

    if (csrfToken) {
      axios.defaults.headers.common["X-CSRF-Token"] = csrfToken;
    }

    if (isAuthenticated) {
      this.setupAuth();
    }

    this.enablePopups();
  }

  // Check if the user is authenticated
  isAuthenticated(): boolean {
    const userMeta = document.querySelector('meta[name="current-user"]');
    return userMeta?.getAttribute("content") === "true";
  }

  // get CSRF token
  getCsrfToken(): string | null | undefined {
    return document
      .querySelector('meta[name="csrf-token"]')
      ?.getAttribute("content");
  }

  // enable popups and create dashboard button for authenticated only
  setupAuth() {
    enablePopup("see-dashboards");
    enablePopup("see-recents");
    enablePopup("see-templates");

    this.setupCreateDashboard();
  }

  // create dashboard button
  setupCreateDashboard() {
    const createBtn = document.querySelector(
      "#create-dashboard"
    ) as HTMLElement;
    if (createBtn) {
      createBtn.addEventListener("click", this.handleCreateDashboard);
    }
  }
  // even listener of dashboard button handler
  async handleCreateDashboard() {
    openModal(
      "Create Blank Dashboard",
      "Dashboard Name",
      "name",
      "Create",
      async (name) => {
        await createDashboard(name);
      }
    );
  }

  enablePopups() {
    enablePopup("seeAccount"); // popupaccount
  }
}
