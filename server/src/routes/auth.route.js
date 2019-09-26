const authController = require("../controllers/auth.controller");
const router = require("express").Router();
const {checkAuth} = require("../services/auth.service");


//log in
router.post("/login", authController.login);

//log out
router.post("/logout", authController.logout);

//xoa bo tat ca token
router.delete("/removeAllTokens", checkAuth, authController.destroyAllToken)


module.exports = router;