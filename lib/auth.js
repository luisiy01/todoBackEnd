const jwt = require("jsonwebtoken");

module.exports = {
  createToken: (payload, callback) => {
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { algorithm: process.env.JWT_ALGORITHM },
      (err, token) => {
        callback(err, token);
      }
    );
  },
};
