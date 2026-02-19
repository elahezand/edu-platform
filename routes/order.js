const express = require("express");
const router = express.Router();
const { authUser } = require("../middlewares/authMiddleware");
const validateObjectIdParam = require("../middlewares/objectId");


const controller = require("../controllers/order");

router.get("/", authUser, controller.get);
router.get("/:id", authUser,validateObjectIdParam, controller.getOne);


module.exports = router;
