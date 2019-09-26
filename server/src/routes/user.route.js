/*
 * @Author: Khoayenn 
 * @Date: 2019-08-13 12:09:42 
 * @Last Modified by:   Khoayenn 
 * @Last Modified time: 2019-08-13 12:09:42 
 */
const router = require("express").Router();
const userController =require("../controllers/user.controller")
const {checkAuth, isAdmin} = require("../services/auth.service")
const {validate, validateUpdate} = require("../services/user.validator");
const { resetPasswordValidate } = require("../services/request.validator");
const { uploadAvatar} = require("../services/upload");

//tao user
router.post("/", validate, userController.createUser);

//update user
router.put("/", checkAuth, validateUpdate, userController.updateUser)

//lay thong tin 1 user
router.get("/", checkAuth, userController.getUser) //fixed => get one user in token

//doi avatar
router.post("/avatar", checkAuth, uploadAvatar, userController.updateAvatar)


//verify user bang ma code
router.post("/verify", userController.verify)

//quen mat khau (req.body = {email})
router.post("/forgetPassword", userController.forgetPassword)

//doi mat khau (quen mat khau)
router.post("/changePassword", resetPasswordValidate, userController.changePassword)


module.exports = router;