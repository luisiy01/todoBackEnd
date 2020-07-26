const jwt = require("jsonwebtoken");
const Token = require("../models/Token");
const moment = require("moment");
const { replier } = require("../lib/utils");

module.exports = {
  ensureAuth: (req, res, next) => {
    try {
      const userToken = req.headers["access-token"];
      if (userToken) {
        jwt.verify(userToken, process.env.JWT_SECRET, function (err, decoded) {
          if (err) {
            return replier(res, 400, {
              response: "Error",
              message: "Invalid Token",
            });
          } else {
            Token.findOne({ token: userToken }, (err, findToken) => {
              if (findToken) {
                const now = moment(
                  moment().format(process.env.MOMENT_FORMAT),
                  process.env.MOMENT_FORMAT
                );
                const exp = moment(
                  findToken.expiration,
                  process.env.MOMENT_FORMAT
                );
                //check its expiration
                if (!exp.isAfter(now)) {
                  return replier(res, 400, {
                    response: "Error",
                    message: "Invalid Token",
                  });
                }
                req.decoded = decoded;
                next();
              } else {
                return replier(res, 400, {
                  response: "Error",
                  message: "Invalid Token",
                });
              }
            });
          }
        });
      } else {
        return replier(res, 400, {
          response: "Error",
          message: "Missing JWT",
        });
      }
    } catch (err) {
      console.log(err);
      return replier(res, 500, {
        response: "Error",
        message: "Server Error",
      });
    }
  },
};
