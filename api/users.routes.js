const express = require("express");
const router = express.Router();

const userController = require("../controllers/user");

router.get("/domains", userController.getDomains);

router.get("/:id", userController.getUserById);

router.get("/", userController.getUsers);

router.put("/:id", userController.updateUserById);

router.delete("/:id", userController.deleteUserById);

router.post("/", userController.postAddUser);

module.exports = router;
