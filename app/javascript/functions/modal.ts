// opening popUp
export const enablePopup = (buttonId: string) => {
  const openBtn = document.getElementById(buttonId) as HTMLElement | null;
  if (!openBtn) {
    console.warn(`Button with ID '${buttonId}' not found.`);
    return;
  }

  const modalId = openBtn.getAttribute("data_modal") as string | null;
  if (!modalId) {
    console.warn(`No 'data-modal' attribute found for button '${buttonId}'.`);
    return;
  }

  const modal = document.getElementById(modalId) as HTMLElement | null;
  if (!modal) {
    console.warn(`Modal with ID '${modalId}' not found.`);
    return;
  }

  openBtn.addEventListener("click", function onClick() {
    modal.classList.toggle("hidden");
    closePopup(modal, openBtn);
  });
};

// closing popup
const closePopup = (popup: HTMLElement, openBtn: HTMLElement) => {
  document.addEventListener("click", function (e: Event) {
    if (
      !popup.contains(e.target as Node) &&
      !openBtn.contains(e.target as Node)
    ) {
      popup.classList.add("hidden");
    }
  });
};

// Show the modal with dynamic content
export const openModal = (
  title: string,
  label: string,
  fieldName: string,
  buttonText: string,
  callback: (value: string) => void
) => {
  const modal = document.querySelector("#modal") as HTMLElement;
  const modalTitle = document.querySelector("#modal-title") as HTMLElement;
  const modalLabel = document.querySelector("#modal-label") as HTMLElement;
  const modalInput = document.querySelector("#modal-input") as HTMLInputElement;
  const modalButton = document.querySelector(
    "#modal-button"
  ) as HTMLInputElement;
  const modalForm = document.querySelector("#modal-form") as HTMLFormElement;
  closeModal(modal);

  modalTitle.textContent = title;
  modalLabel.textContent = label;
  modalInput.name = fieldName;
  modalInput.value = "";
  modalButton.value = buttonText;
  modal.classList.remove("hidden");

  modalForm.onsubmit = (event) => {
    event.preventDefault();
    callback(modalInput.value);
    modal.classList.add("hidden");
  };
};

// closing overlay & modal
export const closeModal = (modal: HTMLElement) => {
  const closeBtn = modal.querySelector(".modal__close") as HTMLElement | null;
  if (!closeBtn) {
    console.warn("Close button not found in modal.");
    return;
  }

  modal.addEventListener("click", function (e: Event) {
    if (!(e.target as HTMLElement)?.closest(".modal")) {
      modal.classList.add("hidden");
    }
  });

  closeBtn.addEventListener("click", function () {
    modal.classList.add("hidden");
  });
};

// Sidebar
export const enableSidebar = () => {
  const sidebar = document.querySelector(".sidebar");
  const toggleButton = sidebar?.querySelector(".sidebar__toggle");

  toggleButton?.addEventListener("click", function () {
    sidebar?.classList.toggle("collapsed");
  });
};

export const useToast = (message: string, type: string) => {
  const getAssetUrl = (imageName: string) => {
    return `/assets/${imageName}`;
  };

  const toast = document.createElement("div");
  toast.className = `toast toast_${type} flex items-center justify-center cursor-pointer`;
  toast.innerHTML = `
      <img src="${getAssetUrl(
        "cross.svg"
      )}" alt="Close" class="toast__close cursor-pointer">
      <div class="taost__message">${message}</div>
  `;

  document.body.insertAdjacentElement("afterbegin", toast);

  // Automatically remove the alert after 3 seconds
  setTimeout(() => {
    toast.classList.add("fade-out");
    setTimeout(() => {
      toast.remove();
    }, 1500);
  }, 3000);

  const closeButton = toast.querySelector(".toast__close");
  if (closeButton) {
    closeButton.addEventListener("click", () => {
      toast.remove();
    });
  }
};
