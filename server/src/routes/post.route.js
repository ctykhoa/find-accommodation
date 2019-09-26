/*
 * @Author: Khoayenn 
 * @Date: 2019-08-12 18:14:06 
 * @Last Modified by: Khoayenn
 * @Last Modified time: 2019-08-13 12:02:48
 */
const router = require("express").Router();
const ratingRouter = require("./rating.route");
const postController = require("../controllers/post.controller")
const {checkAuth} = require("../services/auth.service")
const { validate , validateUpdate} = require("../services/post.validator");
const { validateId } = require("../commons/idCheck");
const { uploadPhotos} = require("../services/upload");

// Check format objectId
router.param('postId', validateId);

// Tim post theo id va gan vao req.post
router.param('postId', postController.findPost);

// Tay tat ca cac bai post
router.get("/", postController.getPosts)

// Tao post
router.post("/", checkAuth, uploadPhotos, validate, postController.createPost);

// Update post
router.put("/:postId", checkAuth, uploadPhotos, validateUpdate, postController.updatePost)

// Xem 1 bai post
router.get("/:postId", postController.getPost)

// Xoa post
router.delete("/:postId", checkAuth, postController.removePost)

// Chuyen huong den rating router
router.use("/:postId/rating", ratingRouter)


module.exports = router