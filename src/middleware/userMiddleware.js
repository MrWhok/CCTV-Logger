const User = require('../models/user');

const checkUserExists = async (req, res, next) => {
  try {
    const { username } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    next();
  } catch (err) {
    next(err);
  }
};

const validateUserData = (req, res, next) => {
  const { username, password, firstName, lastName } = req.body;
  if (!username || !password || !firstName || !lastName) {
    return res.status(400).json({ message: "All fields are required" });
  }
  next();
};

module.exports = {
  checkUserExists,
  validateUserData,
};
