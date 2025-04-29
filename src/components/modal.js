export function openModal(modal) {
  modal.classList.add('popup_is-opened');
  document.addEventListener('keydown', closeByEsc);
}

export function closeModal(modal) {
  if (modal) {
    modal.classList.remove('popup_is-opened');
    document.removeEventListener('keydown', closeByEsc);
  }
}

function closeByEsc(event) {
  if (event.key === 'Escape') {
    const openedPopup = document.querySelector('.popup_is-opened');
    closeModal(openedPopup);
  }
}