import "../../assets/stylesheets/dashboard.scss";
import { enableModal, enableSidebar } from "../functions/modal";

document.addEventListener("turbo:load", () => {
  enableModal("createList");
  enableSidebar();
});
