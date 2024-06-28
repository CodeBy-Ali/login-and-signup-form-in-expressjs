import {
  hideFailedValidation,
  displayFailedValidation,
  showServerResponse,
  togglePasswordVisibility
} from "../utils/domManipulation.mjs";

import { isEmailValid,isPasswordValid } from "../utils/validate.mjs";







const submitForm = async (userData) => {
  try {
    const response = await fetch('/login', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData)
    })
    console.log(response)
    if (!response.ok) {
      const data = await response.json();
      console.log(data)
      showServerResponse(data.message, response.ok);
    }

    if (response.redirected) {
      window.location.href = response.url;
    }
  } catch (err) {
    console.log(err);
  }

}




const validateForm = (e) => {
  e.preventDefault();
  const form = document.querySelector('[data-loginForm]');
  const [email, password] = form;
  const emailValue = email.value;
  const passwordValue = password.value;


  let valid = true;

  if (!emailValue || !isEmailValid(emailValue)) {
    displayFailedValidation(email.parentElement);
    valid = false;
  }

  if (!passwordValue || !isPasswordValid(passwordValue)) {
    displayFailedValidation(password.parentElement);
    valid = false;
  }

  if (valid) {
    submitForm({
      email: emailValue,
      password: passwordValue
    })
  }
}







const App = () => {
  const loginBtn = document.querySelector("[data-login]");
  const eyeIcon = document.querySelector('[data-eyeIcon]');
  const inputFields = document.querySelectorAll("form * input");

  
  inputFields.forEach((field) => field.addEventListener('focus', (e) => hideFailedValidation(e.target.parentElement)));
  eyeIcon.addEventListener('click', togglePasswordVisibility);
  loginBtn.addEventListener('click', validateForm);
}

document.addEventListener('DOMContentLoaded', App);
























