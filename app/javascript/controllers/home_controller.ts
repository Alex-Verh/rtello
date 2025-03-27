import "../../assets/stylesheets/home.scss";
import { createTemplate, searchTemplates } from "../api/templates";
import axios from "axios";
import { openModal } from "../functions/modal";
import { templateHTML } from "../dom";
import { TemplateResponse } from "../interfaces";
import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["home"];

  connect() {
    document.addEventListener("turbo:load", () => {
      const csrfToken = document
        .querySelector('meta[name="csrf-token"]')
        ?.getAttribute("content");

      if (csrfToken) {
        axios.defaults.headers.common["X-CSRF-Token"] = csrfToken;
      }

      // create template
      const createBtn = document.querySelector(
        "#create-template"
      ) as HTMLElement;
      if (createBtn) {
        createBtn.addEventListener("click", () => {
          openModal(
            "Create New Template",
            "Template Name",
            "name",
            "Create",
            async (name) => {
              await createTemplate(name);
            }
          );
        });

        // search templates
        const searchBtn = document.querySelector(
          "#search-templates"
        ) as HTMLElement;
        if (searchBtn) {
          const templatesContainer = document.querySelector(
            "#templates-container"
          ) as HTMLElement;
          if (!templatesContainer) return;

          searchBtn.addEventListener("click", () => {
            openModal(
              "Search Template",
              "Template Name",
              "name",
              "Search",
              async (name) => {
                const templates = (await searchTemplates(
                  name
                )) as Array<TemplateResponse>;

                templatesContainer.innerHTML = "";

                templates.forEach((template: TemplateResponse) => {
                  templatesContainer.insertAdjacentElement(
                    "afterbegin",
                    templateHTML(template.id, template.container.name)
                  );
                });
              }
            );
          });
        }
      }
    });
  }
}
