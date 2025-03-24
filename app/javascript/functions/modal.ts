// opening modal
export const enableModal = (buttonId: string, isPopup: boolean = false) => {
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
    modal.classList.remove("hidden");
    isPopup ? closePopup(modal, openBtn) : closeModal(modal);
  });
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

// closing popup
export const closePopup = (popup: HTMLElement, openBtn: HTMLElement) => {
  document.addEventListener("click", function (e: Event) {
    if (
      !popup.contains(e.target as Node) &&
      !openBtn.contains(e.target as Node)
    ) {
      popup.classList.add("hidden");
    }
  });
};
