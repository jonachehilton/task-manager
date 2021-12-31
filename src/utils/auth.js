const jwt = require('jsonwebtoken');

export const getToken = (user) => jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7 days' });