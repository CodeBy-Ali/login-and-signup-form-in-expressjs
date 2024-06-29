import path from 'path';
import config from '../config/config.js';
import User from '../models/userModel.js';






export const authenticateUser = async (req, res,next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    res.status(404).json({ error: "We couldn't find an account with that email address" });
    return
  }

  if (user.password !== password) {
    res.status(400).json({ error: "Incorrect password" });
    return;
  }
  
  res.redirect('dashboard');
}


export const registerNewUser = async (req, res) => { 
  const { email, password } = req.body;
  
  const user = new User({
    email: email,
    password: password,
  })

  // check for duplicate user request
  try {
    const duplicateUser = await User.findOne({ email: email });
    if (duplicateUser) {
      res.status(400).json({ error: `Email already registered` });
      return;
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }

  // create new User
  try {
    const newUser = await user.save();
    res.redirect('login')
  } catch (err) { 
    console.log(err)
    res.status(500).json({ error: `Internal Server Error` });
  }
}


export const sendSignUpPage = (req,res) => {
  res.sendFile(path.join(config.dir.static, 'src/pages/signup.html'));
}



export const sendLoginPage = (req, res) => {
  res.sendFile(path.join(config.dir.static, 'src/pages/login.html'));
}