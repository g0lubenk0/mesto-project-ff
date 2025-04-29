function setInputEventListeners(form, config) {
  const formInputs = Array.from(form.querySelectorAll(config.inputSelector));
  const formSubmitButton = form.querySelector(config.submitButtonSelector);
  toggleSubmitButtonState(formInputs, formSubmitButton, config);
  formInputs.forEach((input) => {
    input.addEventListener('input', () => {
      validation(form, input, config);
      toggleSubmitButtonState(formInputs, formSubmitButton, config);
    });
  });
}

export function enableValidation(validationConfig) {
  const formList = Array.from(document.querySelectorAll(validationConfig.formSelector));

  formList.forEach((formElement) => {
    setInputEventListeners(formElement, validationConfig);
  });
}

function showInputError(form, input, errorMessage, config) {
  const inputError = form.querySelector(`.${input.id}-error`);
  input.classList.add(config.inputErrorClass);
  inputError.textContent = errorMessage;
  inputError.classList.add(config.errorClass);
}

function hideInputError(form, input, config) {
  const inputError = form.querySelector(`.${input.id}-error`);
  input.classList.remove(config.inputErrorClass);
  inputError.classList.remove(config.errorClass);
  inputError.textContent = "";
}

function validation(form, input, config) {
  const inputName = input.getAttribute('name');
  if (!input.validity.valid) {
    if (input.validity.valueMissing) {
      showInputError(form, input, `Вы пропустили это поле`, config);
    }
    if (input.validity.tooShort) {
      showInputError(form, input, `Минимальное количество символов: ${input.getAttribute("minlength")}. Длина текста сейчас: ${input.value.length}`, config);
    }
    if (input.validity.tooLong) {
      showInputError(form, input, `Максимальное количество символов: ${input.getAttribute("maxlength")}. Длина текста сейчас: ${input.value.length}`, config);
    }
    if ((inputName === 'link' || inputName === 'avatar-link') && input.validity.patternMismatch) {
      showInputError(form, input, `Допустимы только валидные ссылки`, config);
    }
    if (inputName !== 'link' && inputName !== 'avatar-link' && input.validity.patternMismatch) {
      showInputError(form, input, input.getAttribute('data-error'), config);
    }
  } else {
    hideInputError(form, input, config);
  }
}

const hasInvalidInput = (inputList) => {
  return inputList.some((inputElement) => {
    return !inputElement.validity.valid;
  });
};

function toggleSubmitButtonState(inputList, buttonElement, config) {
  if (hasInvalidInput(inputList)) {
    buttonElement.disabled = true;
    buttonElement.classList.add(config.inactiveButtonClass);
  } else {
    buttonElement.disabled = false;
    buttonElement.classList.remove(config.inactiveButtonClass);
  }
}

export function clearValidation(form, validationConfig) {
  const inputList = Array.from(form.querySelectorAll(validationConfig.inputSelector));
  const submitButton = form.querySelector(validationConfig.submitButtonSelector);
  inputList.forEach((input) => {
    hideInputError(form, input, validationConfig);
  });
  toggleSubmitButtonState(inputList, submitButton, validationConfig);
}