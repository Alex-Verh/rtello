import "../../assets/stylesheets/home.scss";
import { createTemplate, searchTemplates } from "../api/templates";
import axios from "axios";
import { openModal } from "../functions/modal";
import { templateHTML } from "../dom";
import { TemplateResponse } from "../interfaces";
import { Controller } from "@hotwired/stimulus";

export default class HomeController extends Controller {
  connect() {
    const csrfToken = this.getCsrfToken();

    if (csrfToken) {
      axios.defaults.headers.common["X-CSRF-Token"] = csrfToken;
    }

    this.setupCreateTemplate();
    this.setupSearchTemplate();
  }

  // get CSRF token
  getCsrfToken(): string | null | undefined {
    return document
      .querySelector('meta[name="csrf-token"]')
      ?.getAttribute("content");
  }

  // create template btn
  setupCreateTemplate() {
    const createBtn = document.querySelector("#create-template") as HTMLElement;
    if (createBtn) {
      createBtn.addEventListener("click", this.handleCreateTemplate);
    }
  }

  // handling click on template btn
  async handleCreateTemplate() {
    openModal(
      "Create New Template",
      "Template Name",
      "name",
      "Create",
      async (name) => {
        await createTemplate(name);
      }
    );
  }

  // search template btn
  setupSearchTemplate() {
    const searchBtn = document.querySelector(
      "#search-templates"
    ) as HTMLElement;
    if (searchBtn) {
      const templatesContainer = document.querySelector(
        "#templates-container"
      ) as HTMLElement;
      if (!templatesContainer) return;

      searchBtn.addEventListener("click", () => {
        this.handleSearchTemplates(templatesContainer);
      });
    }
  }

  // handling search templates btn
  async handleSearchTemplates(templatesContainer: HTMLElement) {
    openModal(
      "Search Template",
      "Template Name",
      "name",
      "Search",
      async (name) => {
        const templates = (await searchTemplates(
          name
        )) as Array<TemplateResponse>;

        this.updateTemplates(templatesContainer, templates);
      }
    );
  }

  // update searched templates
  updateTemplates(
    templatesContainer: HTMLElement,
    templates: Array<TemplateResponse>
  ) {
    templatesContainer.innerHTML = "";

    templates.forEach((template: TemplateResponse) => {
      templatesContainer.insertAdjacentElement(
        "afterbegin",
        templateHTML(template.id, template.container.name)
      );
    });
  }
}
