const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Token = require("../models/Token");
const bcrypt = require("bcrypt");
const moment = require("moment");
const { replier } = require("../lib/utils");
const { createToken } = require("../lib/auth");
const { validateUserParams } = require("../middleware/validate");
const { validationResult } = require("express-validator");

const saltRounds = 10;

// @desc    RegisterUser
// @route   /auth/user/register
router.post("/user/register", validateUserParams, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return replier(res, 400, {
          response: "Error",
          message: errors.array(),
        });
      } else {
        //register user
        var newUser = new User();
        bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
          if (err) {
            return replier(res, 400, {
              response: "Error",
              message: "Error hash password",
            });
          }

          newUser.password = hash;
          newUser.email = req.body.email;

          newUser.save((err, user) => {
            if (err) {
              return replier(res, 400, {
                response: "Error",
                message: "Error creating user",
              });
            }

            return replier(res, 200, {
              response: "ok",
              message: "User created",
            });
          });
        });
      }
    } else {
      // email exixts
      return replier(res, 400, {
        response: "Error",
        message: "User already exists",
      });
    }
  } catch (ex) {
    console.error(err);
    return replier(res, 400, {
      response: "Error",
      message: "Something went wrong",
    });
  }
});

// @desc    LoginUser
// @route   /auth/user/login
router.post("/user/login", validateUserParams, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return replier(res, 400, {
        response: "Error",
        message: errors.array(),
      });
    } else {
      const user = await User.findOne({ email: req.body.email });
      if (user) {
        bcrypt.compare(req.body.password, user.password, (err, ress) => {
          if (err) {
            return replier(res, 500, {
              response: "Error",
              message: "Something went wrong",
            });
          }

          if (!ress) {
            return replier(res, 401, {
              response: "Error",
              message: "Invalid Email or Password",
            });
          }

          //create token
          const expiration = moment()
            .add(process.env.EXPIRATION_INTERVAL, process.env.EXPIRATION_TYPE)
            .format(process.env.MOMENT_FORMAT);

          createToken({ user_id: user._id }, (err, token) => {
            if (err) {
              return replier(res, 500, {
                response: "Error",
                message: "Internal error",
              });
            }
            tokens = Token.findOne({ user_id: user._id });

            //remove token if exists
            if (tokens) {
              Token.deleteOne({ user_id: user._id }, (err, res) => {
                if (err) {
                  return replier(res, 500, {
                    response: "Error",
                    message: "Internal error",
                  });
                }
              });
            }

            //save token
            const tokenModel = new Token();
            tokenModel.user_id = user._id;
            tokenModel.token = token;
            tokenModel.expiration = expiration;

            tokenModel.save((err, model) => {
              if (err) {
                return replier(res, 500, {
                  response: "Error",
                  message: "Internal error",
                });
              }
              return replier(res, 200, {
                response: "Ok",
                message: "SUCCESS",
                user: {
                  _id: user._id,
                  email: user.email,
                },
                authToken: token,
              });
            });
          });
          return;
        });
      } else {
        return replier(res, 401, {
          response: "Error",
          message: "Invalid Email or Password",
        });
      }
    }
  } catch (err) {
    console.error(err);
    return replier(res, 400, {
      response: "Error",
      message: "Something went wrong",
    });
  }
});

module.exports = router;
