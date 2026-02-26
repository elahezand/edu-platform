const express = require("express");
const router = express.Router();
const { identifyUser } = require("../middlewares/authMiddleware");
const validateObjectIdParam = require("../middlewares/objectId");


const controller = require("../controllers/order");

router.get("/", identifyUser, controller.get);
router.get("/:id", identifyUser,validateObjectIdParam, controller.getOne);


module.exports = router;
