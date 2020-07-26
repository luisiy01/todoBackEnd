const { body, param } = require("express-validator");

module.exports = {
  registerTask: [
    body("text").isString().exists(),
    body("dueDate").isString().exists(),
    body("user_id").isString().exists(),
  ],
  validateUserParams: [
    body("email").isEmail().exists(),
    body("password").isString().exists(),
  ],
  deleteUpdateTask: [
    param('id').exists().isString()
  ]
};
