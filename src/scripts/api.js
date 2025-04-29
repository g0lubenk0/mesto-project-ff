const config = {
  baseUrl: 'https://nomoreparties.co/v1/cohort-mag-4',
  headers: {
    authorization: '0b3fc1eb-d6e5-499a-8d61-241f60c1b8c5',
    'Content-Type': 'application/json'
  }
};
  
export const getResponseWithCheck = (response) => {
  if (response.ok) {
    return response.json();
  }
  return Promise.reject(`Ошибка: ${response.status}`);
};
  
export const getUserInfo = () => {
  return fetch(`${config.baseUrl}/users/me`, {
    headers: config.headers
  }).then(getResponseWithCheck);
};
  
export const getInitialCards = () => {
  return fetch(`${config.baseUrl}/cards`, {
    headers: config.headers
  }).then(getResponseWithCheck);
};
  
export const updateUserInfo = (payload) => {
  return fetch(`${config.baseUrl}/users/me`, {
    method: 'PATCH',
    headers: config.headers,
    body: JSON.stringify(payload)
  }).then(getResponseWithCheck);
};
  
export const addCard = (payload) => {
  return fetch(`${config.baseUrl}/cards`, {
    method: 'POST',
    headers: config.headers,
    body: JSON.stringify(payload)
  }).then(getResponseWithCheck);
};
  
export const deleteCardFromServer = (id) => {
  return fetch(`${config.baseUrl}/cards/${id}`, {
    method: 'DELETE',
    headers: config.headers
  }).then(getResponseWithCheck);
};
  
export const setLike = (id, isLiked) => {
  return fetch(`${config.baseUrl}/cards/likes/${id}`, {
    method: isLiked ? 'DELETE' : 'PUT',
    headers: config.headers
  }).then(getResponseWithCheck);
};
  
export const updateUserAvatar = (payload) => {
  return fetch(`${config.baseUrl}/users/me/avatar`, {
    method: 'PATCH',
    headers: config.headers,
    body: JSON.stringify(payload)
  }).then(getResponseWithCheck);
};