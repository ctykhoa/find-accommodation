const router = require("express").Router();
const multer =require("multer")
const adminController =require("../controllers/admin.controller")
const {checkAuth, isAdmin} = require("../services/auth.service")
const {uploadPhoto} = require("../services/upload");
const {validate, validateUpdate} = require("../services/user.validator");
const { validateId } = require("../commons/idCheck");
const {findUser} = require("../controllers/user.controller");



//check format Object Id
router.param("userId", validateId);
//find User in param
router.param("userId", findUser)

//deactive user
router.post("/:userId/deactive", adminController.deactivateUser)

//xoa user
router.delete("/:userId", adminController.removeUser)
module.exports= router