const createNotification = (textContent,className) => {
  const container = document.createElement('div');
  const paragraph = document.createElement('p');
  paragraph.textContent = textContent;
  container.appendChild(paragraph);
  container.classList.add(className);
  return container;
}

// renders the server response in the form of notification
export const showServerResponse = (message,isResponseOk) => {
  const notificationCenter = document.querySelector('[data-notificationCenter]');
  const notificationClass = isResponseOk ? 'notification--success' : 'notification--error';
  const notification = createNotification(message, notificationClass);
  notificationCenter.appendChild(notification);
  setTimeout(() => notificationCenter.removeChild(notification), 3000);
}

export const displayFailedValidation = (element) => element.classList.add("failedValidation");

export const hideFailedValidation = (element) => element.classList.remove("failedValidation");

export const togglePasswordVisibility = (e) => {
  e.preventDefault();
  const eyeIcon = e.target;
  const passwordFields = document.querySelectorAll('[data-password]');
  passwordFields.forEach(passwordField => {
    if (passwordField.type === 'password') {
      passwordField.type = "text";
      eyeIcon.classList.remove('fa-eye-slash');
      eyeIcon.classList.add('fa-eye')
    } else {
      passwordField.type = "password";
      eyeIcon.classList.add('fa-eye-slash');
      eyeIcon.classList.remove('fa-eye');
    }
  })

  
}