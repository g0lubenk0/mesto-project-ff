// Функция создания карточки
export function createCard(cardData, userId, handleDeleteCardButtonClick, handleLikeCard, setLike, openImageCallback) {
  const cardTemplate = document.querySelector('#card-template').content;
  const cardElement = cardTemplate.querySelector('.card').cloneNode(true);

  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const deleteButton = cardElement.querySelector('.card__delete-button');
  const likeButton = cardElement.querySelector('.card__like-button');
  const likesCount = cardElement.querySelector('.card__likes-count');

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;
  likesCount.textContent = cardData.likes.length;

  // Удаление карточки (только для своих карточек)
  if (cardData.owner._id !== userId) {
    deleteButton.style.display = 'none';
  } else {
    deleteButton.addEventListener('click', () => handleDeleteCardButtonClick(cardElement, cardData._id));
  }

  // Лайк карточки
  const isLiked = cardData.likes.some((like) => like._id === userId);
  if (isLiked) {
    likeButton.classList.add('card__like-button_is-active');
  }

  likeButton.addEventListener('click', () => {
    handleLikeCard(likeButton, cardData._id, likesCount, setLike);
  });

  // Открытие изображения
  cardImage.addEventListener('click', () => {
    openImageCallback(cardData);
  });

  return cardElement;
}

// Функция удаления карточки
export function handleDeleteCard(cardElement, deleteCardFromServer, cardId) {
  return deleteCardFromServer(cardId)
    .then(() => {
      cardElement.remove();
    })
    .catch((error) => {
      console.log(`Ошибка при удалении карточки: ${error}`);
    });
}

// Функция лайка карточки
export function handleLikeCard(likeButton, cardId, likesCount, setLike) {
  const isLiked = likeButton.classList.contains('card__like-button_is-active');

  setLike(cardId, isLiked)
    .then((updatedCard) => {
      likeButton.classList.toggle('card__like-button_is-active');
      likesCount.textContent = updatedCard.likes.length;
    })
    .catch((error) => {
      console.log(`Ошибка при постановке/снятии лайка: ${error}`);
    });
}