const express = require("express");

const router = express.Router();

const UserController = require("../controllers/UserControllers");
const uploader = require("../../../epress-test/express/utils/uploadeServices");

router.get("", UserController.findAll);
router.get("/:id", UserController.findOne);
router.post("", 
    // uploader.single("avatar"), 
    // uploader.array("docs" , 5), 
    uploader.fields([
        {name : "avatar" , maxCount : 2} ,
        {name : "docs" , maxCount : 5}
    ]),
    UserController.createUser);
router.put("/:id", UserController.updateUser);
router.delete("/:id", UserController.removeUser);

module.exports = router;
