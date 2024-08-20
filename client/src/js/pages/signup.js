import { hideFailedValidation, displayFailedValidation, showErrorNotification, togglePasswordVisibility } from "../utils/domManipulation.mjs";
import * as queryString from 'querystring';
import { isEmailValid, isPasswordValid } from "../utils/validate.mjs";











const submitForm = async (userData) => {
  try {
    const response = await fetch("/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const data = await response.json();
      showErrorNotification(data.error);
    }

    if (response.redirected) {
      window.location.href = response.url;
    }
  } catch (error) {
    console.log(error);
  }
};

const validateForm = (e) => {
  e.preventDefault();
  const form = document.querySelector("[data-signupForm]");
  const [email, createPassword, confirmPassword] = form.elements;

  const emailValue = email.value.trim();
  const createPasswordValue = createPassword.value.trim();
  const confirmPasswordValue = confirmPassword.value.trim();

  let valid = true;

  if (!isEmailValid(emailValue)) {
    displayFailedValidation(email.parentElement);
    valid = false;
  }

  if (!isPasswordValid(createPasswordValue)) {
    displayFailedValidation(createPassword.parentElement);
    valid = false;
  }

  if (confirmPasswordValue.length < 1 || createPasswordValue !== confirmPasswordValue) {
    displayFailedValidation(confirmPassword.parentElement);
    valid = false;
  }

  if (valid) {
    submitForm({
      email: emailValue,
      password: createPasswordValue,
    });
  }
};

const App = () => {
  const signUpBtn = document.querySelector("[ data-signUp]");
  const inputFields = document.querySelectorAll("form * input");
  const eyeIcon = document.querySelector("[data-eyeIcon]");
  const googleLoginAnchor = document.querySelector('a[data-google-login-link]');

  eyeIcon.addEventListener("click", togglePasswordVisibility);
  inputFields.forEach((field) => field.addEventListener("focus", (e) => hideFailedValidation(e.target.parentElement)));
  signUpBtn.addEventListener("click", validateForm);
};

document.addEventListener("DOMContentLoaded", App);


console.log(process.env.CLIENT_ID)