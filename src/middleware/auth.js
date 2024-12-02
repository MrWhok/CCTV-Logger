const { Request, Response, NextFunction } = require('express');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

const SECRET_KEY = config.secretKey;

const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    res.status(401).json({ message: 'Access denied' });
    return;
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = { id: decoded.userId };
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid token' });
  }
};

module.exports = {
  authenticate,
};