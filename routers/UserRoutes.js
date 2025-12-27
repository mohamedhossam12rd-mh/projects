const express = require("express")

const router = express.Router()

const UserController = require("../controllers/UserControllers")

router.get("" , UserController.findAll)
router.get("/:id" , UserController.findOne)
router.post("" ,UserController.createUser)
router.put("/:id" , UserController.updateUser)
router.delete("/:id" , UserController.removeUser)

module.exports = router