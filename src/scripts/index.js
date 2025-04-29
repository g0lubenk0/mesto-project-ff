import "../pages/index.css";
import { createCard, handleDeleteCard, handleLikeCard } from '../components/card.js';
import { openModal, closeModal } from '../components/modal.js';
import { enableValidation, clearValidation } from './validation.js';
import { addCard, setLike, deleteCardFromServer, getInitialCards, getUserInfo, updateUserInfo, updateUserAvatar } from './api.js';

// DOM-элементы
const profileEditButton = document.querySelector('.profile__edit-button');
const profileAddButton = document.querySelector('.profile__add-button');
const profileEditModal = document.querySelector('.popup_type_edit');
const cardAddModal = document.querySelector('.popup_type_new-card');
const avatarElement = document.querySelector('.profile__image');
const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
const profileForm = document.forms['edit-profile'];
const cardForm = document.forms['new-place'];
const cardNameInput = cardForm.querySelector('.popup__input_type_card-name');
const cardLinkInput = cardForm.querySelector('.popup__input_type_url');
const placesList = document.querySelector('.places__list');

// Элементы модального окна с изображением
const imageModal = document.querySelector('.popup_type_image');
const imageModalImage = imageModal.querySelector('.popup__image');
const imageModalCaption = imageModal.querySelector('.popup__caption');

// Элементы модального окна с изменением аватарки
const avatarModal = document.querySelector('.popup_type_avatar');
const avatarForm = document.forms['edit-avatar'];
const avatarLinkInput = avatarForm.querySelector('.popup__input_type_url');

// Модальное окно удаления карточки
const deleteCardModal = document.querySelector('.popup_type_delete_card');

// Кнопки закрытия модальных окон
const closeButtons = document.querySelectorAll('.popup__close');

// Кнопки сабмита форм
const profileSubmitButton = profileForm.querySelector('.popup__button');
const cardSubmitButton = cardForm.querySelector('.popup__button');
const avatarSubmitButton = avatarForm.querySelector('.popup__button');

let userId;

// Глобальные переменные для удаления карточки
let currentCardElement = null;
let currentCardId = null;

// Конфигурация валидации
const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__input_error_visible'
};

// Функция обработки сабмита удаления карточки
function handleCardDeleteSubmit() {
  handleDeleteCard(currentCardElement, deleteCardFromServer, currentCardId)
    .then(() => {
      closeModal(deleteCardModal);
    })
    .catch((error) => {
      console.log(`Ошибка при удалении карточки: ${error}`);
    });
}

// Добавляем обработчик сабмита удаления карточки один раз
const submitDeleteCardButton = deleteCardModal.querySelector('.popup__button');
submitDeleteCardButton.addEventListener('click', handleCardDeleteSubmit);

// Функция обработки клика по кнопке удаления карточки
function handleDeleteCardButtonClick(cardElement, cardId) {
  currentCardElement = cardElement;
  currentCardId = cardId;
  openModal(deleteCardModal);
}

// Функция открытия модального окна редактирования профиля
function handleProfileEditButtonClick() {
  profileForm.elements.name.value = profileTitle.textContent;
  profileForm.elements.description.value = profileDescription.textContent;
  clearValidation(profileForm, validationConfig);
  openModal(profileEditModal);
}

// Функция открытия модального окна добавления карточки
function handleProfileAddButtonClick() {
  cardForm.reset();
  clearValidation(cardForm, validationConfig);
  openModal(cardAddModal);
}

// Функция обработки отправки формы редактирования профиля
function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  const name = profileForm.elements.name.value;
  const description = profileForm.elements.description.value;

  profileSubmitButton.textContent = 'Сохранение...';

  updateUserInfo({ name, about: description })
    .then((updatedUser) => {
      fillProfileWithResponse(updatedUser.name, updatedUser.about, updatedUser.avatar);
      closeModal(profileEditModal);
    })
    .catch((error) => {
      console.log(`Ошибка при обновлении профиля: ${error}`);
    })
    .finally(() => {
      profileSubmitButton.textContent = 'Сохранить';
    });
}

// Функция обработки отправки формы добавления карточки
function handleCardFormSubmit(evt) {
  evt.preventDefault();
  const newCard = {
    name: cardNameInput.value,
    link: cardLinkInput.value,
  };

  cardSubmitButton.textContent = 'Сохранение...';

  addCard(newCard)
    .then((card) => {
      const cardElement = createCard(card, userId, handleDeleteCardButtonClick, handleLikeCard, setLike, openImageModal);
      placesList.prepend(cardElement);
      closeModal(cardAddModal);
      cardForm.reset();
    })
    .catch((error) => {
      console.log(`Ошибка при добавлении карточки: ${error}`);
    })
    .finally(() => {
      cardSubmitButton.textContent = 'Сохранить';
    });
}

// Функция обработки отправки формы редактирования аватара
function handleAvatarFormSubmit(evt) {
  evt.preventDefault();
  const avatarUrl = avatarLinkInput.value;

  avatarSubmitButton.textContent = 'Сохранение...';

  updateUserAvatar({ avatar: avatarUrl })
    .then((updatedUser) => {
      fillProfileWithResponse(updatedUser.name, updatedUser.about, updatedUser.avatar);
      closeModal(avatarModal);
    })
    .catch((error) => {
      console.log(`Ошибка при обновлении аватара: ${error}`);
    })
    .finally(() => {
      // Возвращаем текст кнопки на "Сохранить"
      avatarSubmitButton.textContent = 'Сохранить';
    });
}

// Загрузка данных пользователя и карточек
Promise.all([getUserInfo(), getInitialCards()])
  .then(([user, cards]) => {
    const { name, about, avatar, _id } = user;
    fillProfileWithResponse(name, about, avatar);
    userId = _id;

    cards.forEach(card => {
      const cardElement = createCard(card, userId, handleDeleteCardButtonClick, handleLikeCard, setLike, openImageModal);
      placesList.append(cardElement);
    });
  })
  .catch((error) => {
    console.log(`Ошибка при загрузке данных: ${error}`);
  });

// Добавляем анимацию всем модальным окнам при загрузке страницы
document.querySelectorAll('.popup').forEach((modal) => {
  modal.classList.add('popup_is-animated');
});

// Заполнение профиля данными
function fillProfileWithResponse(name, about, avatarUrl) {
  profileTitle.textContent = name;
  profileDescription.textContent = about;
  avatarElement.style.backgroundImage = `url(${avatarUrl})`;
}

// Открытие модального окна редактирования профиля и добавления карточки
profileEditButton.addEventListener('click', handleProfileEditButtonClick);
profileAddButton.addEventListener('click', handleProfileAddButtonClick);

closeButtons.forEach((button) => {
  const modal = button.closest('.popup');
  button.addEventListener('click', () => closeModal(modal));
});

// Обработчик отправки формы редактирования профиля и добавления карточки
profileForm.addEventListener('submit', handleProfileFormSubmit);
cardForm.addEventListener('submit', handleCardFormSubmit);

// Обработчик открытия модального окна редактирования аватара
avatarElement.addEventListener('click', () => {
  avatarForm.reset();
  clearValidation(avatarForm, validationConfig);
  openModal(avatarModal);
});

// Обработчик отправки формы редактирования аватара
avatarForm.addEventListener('submit', handleAvatarFormSubmit);

// Функция открытия модального окна с изображением
function openImageModal(cardData) {
  imageModalImage.src = cardData.link;
  imageModalImage.alt = cardData.name;
  imageModalCaption.textContent = cardData.name;
  openModal(imageModal);
}

// Включение валидации форм
enableValidation(validationConfig);