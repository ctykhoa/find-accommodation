/*
 * @Author: Khoayenn 
 * @Date: 2019-08-12 17:56:18 
 * @Last Modified by: Khoayenn
 * @Last Modified time: 2019-08-13 13:43:27
 */

const router = require("express").Router();
const ratingController = require("../controllers/rating.controller")
const {checkAuth} = require("../services/auth.service")
const { validate , validateUpdate} = require("../services/rating.validator");
const { validateId } = require("../commons/idCheck");
const { uploadPhotos } = require("../services/upload");


// Check format Object id
router.param("ratingId", validateId);

// Tim rating theo Id
router.param("ratingId", ratingController.findRating)

// Lay tat ca cac rating
router.get("/", ratingController.getRatings);

// Tao mot rating
router.post("/", checkAuth, uploadPhotos, validate, ratingController.createRating);

// Update mot rating
router.put("/:ratingId", checkAuth, uploadPhotos, validateUpdate, ratingController.updateRating);

// Xoa mot rating
router.delete("/:ratingId", checkAuth,  ratingController.removeRating);


module.exports = router;