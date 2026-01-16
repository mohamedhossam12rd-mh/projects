const express = require("express");

const router = express.Router();

// const uploader = require("../../../epress-test/express/utils/uploadeServices");
const UserController = require("../controllers/UserControllers");

const {uploader} = require("../utils/userServices");
const { AuthMiddleWare } = require("../middlewares/AuthMiddleWare");
const { roleMiddleWare } = require("../middlewares/roleMiddleWare");

router.get("/", UserController.findAll);
router.get("/:id", UserController.findOne);
router.post("", 
    // uploader.single("avatar"), 
    // uploader.array("docs" , 5), 
    uploader.fields([
        {name : "avatar" , maxCount : 2} ,
        {name : "docs" , maxCount : 5}
    ]),
    UserController.createUser);
router.put("/:id",UserController.updateUser);
router.patch("/:id", uploader.single("avatar"), UserController.updateAvatar);

router.delete("/:id", AuthMiddleWare , roleMiddleWare("super_admin"),UserController.removeUser);

module.exports = router;
