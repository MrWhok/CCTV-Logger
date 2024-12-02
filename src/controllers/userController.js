const { Request, Response, NextFunction } = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const config = require("../config/config");

const SECRET_KEY = config.secretKey;

const register = async (req, res, next) => {
  try {
    const { username, password, firstName, lastName } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username, password: hashedPassword, firstName, lastName });
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      res.status(401).json({ message: "Invalid username" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.status(401).json({ message: "Invalid password" });
      return;
    }

    const token = jwt.sign({ username: user.username }, SECRET_KEY, {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (err) {
    next(err);
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
    register,
    login,
    getAllUsers,
};

