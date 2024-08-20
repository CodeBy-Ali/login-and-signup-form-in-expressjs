const isEmailValid = (email) => /^(?!.*\.\.)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~.-]{1,64}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);

const isPasswordValid = (password) => /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}/.test(password);

const validateAuthInput = (req, res, next) => {
  const { email, password } = req.body;

  let message = "";

  if (!email || !isEmailValid(email)) {
    message += "Invalid email";
  }

  if (!password || !isPasswordValid(password)) {
    message += " Invalid password";
  }

  if (message.length > 0) {
    res.status(400).json({ message });
  }

  next();
};

export default validateAuthInput;
