const courseUserModel = require("../models/course-user");
const { paginate } = require("../utils/helper");

exports.get = async (req, res, next) => {
    try {
        const searchParams = new URLSearchParams(req.query);
        const useCursor = searchParams.has("cursor");

        const result = await paginate(
            courseUserModel,
            searchParams,
            { user: req.user._id },
            "course",
            useCursor,
            true
        );
        if (!result) {
            return next({ status: 404, message: "No Order Available!" });
        }

        res.json(result);
    } catch (error) {
        next(error);
    }
};
exports.getOne = async (req, res, next) => {
    try {
        const mainOrder = await courseUserModel
            .find({ _id: req.params.id })
            .populate("course")
            .lean();

        if (!mainOrder) {
            return res.status(404).json({ message: "Order Not Found!" });
        }
        res.json(mainOrder);
    } catch (error) {
        next(error);
    }
};
