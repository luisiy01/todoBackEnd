const express = require("express");
const router = express.Router();
const { ensureAuth } = require("../middleware/auth");
const { replier } = require("../lib/utils");

const { deleteUpdateTask, registerTask } = require("../middleware/validate");
const { validationResult } = require("express-validator");

const Task = require("../models/Task");

//@desc Process add form
//@route    POST /tasks/add
router.post("/add", ensureAuth, registerTask, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return replier(res, 400, {
        response: "Error",
        message: errors.array(),
      });
    } else {
      const task = await Task.create(req.body);
      if (task) {
        return replier(res, 200, {
          response: "Ok",
          message: "SUCCESS",
          task: task,
        });
      } else {
        return replier(res, 500, {
          response: "Error",
          message: "Internal error",
        });
      }
    }
  } catch (err) {
    console.error(err);
    return replier(res, 500, { response: "Error", message: "Internal error" });
  }
});

//@desc Process add form
//@route    PUT /tasks/:id
router.put("/complete/:id", ensureAuth, deleteUpdateTask, async (req, res) => {
  try {    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {      
      return replier(res, 400, {
        response: "Error",
        message: errors.array(),
      });
    } else {
      const task = await Task.updateOne(
        { _id: req.params.id },
        { complete: true }
      );
      if (task.ok) {
        return replier(res, 200, {
          response: "Ok",
          message: "SUCCESS",
          task: task,
        });
      } else {
        return replier(res, 500, {
          response: "Error",
          message: "Internal error",
        });
      }
    }
  } catch (err) {
    console.error(err);
    return replier(res, 500, { response: "Error", message: "Internal error" });
  }
});

//@desc Process delete task
//@route    DELETE /tasks/:id
router.delete("/delete/:id", ensureAuth, deleteUpdateTask, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return replier(res, 400, {
        response: "Error",
        message: errors.array(),
      });
    } else {
      const task = await Task.deleteOne({ _id: req.params.id });
      if (task.ok) {
        return replier(res, 200, {
          response: "Ok",
          message: "SUCCESS",
          task: task,
        });
      } else {
        return replier(res, 500, {
          response: "Error",
          message: "Internal error",
        });
      }
    }
  } catch (err) {
    console.error(err);
    return replier(res, 500, { response: "Error", message: "Internal error" });
  }
});

// @desc    Show all tasks
// @route   Get /:id tasks
router.get("/", ensureAuth, async (req, res) => {
  try {
    const tasks = await Task.find({ user_id: req.decoded.user_id })
      .sort({ dueDate: -1 })
      .populate("user")
      .sort({ createdAt: "desc" })
      .lean();
    return replier(res, 200, {
      response: "Ok",
      message: "SUCCESS",
      tasks: tasks,
    });
  } catch (err) {
    console.error(err);
    return replier(res, 500, { response: "Error", message: "Internal error" });
  }
});

module.exports = router;
