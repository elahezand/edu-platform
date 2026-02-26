const offModel = require("../models/off");
const courseModel = require("../models/course")
const { paginate } = require("../utils/helper");

/* Get All Offs*/
exports.getAll = async (req, res, next) => {
  try {
    const searchParams = new URLSearchParams(req.query);
    const useCursor = searchParams.has("cursor");

    const result = await paginate(
      offModel,
      searchParams,
      {},
      "course creator",
      useCursor,
      true
    );

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
/*Create Off*/
exports.post = async (req, res, next) => {
  try {
    const newOff = await offModel.create({
      ...req.parsed.data,
      creator: req.user._id
    });

    res.status(201).json({ message: "Off created successfully", off: newOff });
  } catch (err) {
    next(err);
  }
};
/*set On All*/
exports.setOnAll = async (req, res, next) => {
  try {
    const newOff = await offModel.create({ ...req.parsed.data, creator: req.user._id });
    await courseModel.updateMany(
      {}, 
      {
        $set: { discount: newOff.percent },
      }
    );

    res.status(201).json({ message: "Off created and applied to all courses", off: newOff });
  } catch (err) {
    next(err);
  }
};

/* Update Off*/
exports.patch = async (req, res, next) => {
  try {
   
    const updatedOff = await offModel.findByIdAndUpdate(
      req.params.id,
      req.parsed.data,
      { new: true }
    );

    if (!updatedOff) return next({ status: 404, message: "Off not found" });

    res.status(200).json({ message: "Off updated successfully", off: updatedOff });
  } catch (err) {
    next(err);
  }
};
/*Delete Off*/
exports.remove = async (req, res, next) => {
  try {
    const deleted = await offModel.findByIdAndDelete(req.params.id);
    if (!deleted) return next({ status: 404, message: "Off not found" });

    res.status(200).json({ message: "Off deleted successfully" });
  } catch (err) {
    next(err);
  }
};
/*apply  Off*/
exports.applyOff = async (req, res, next) => {
  try {
    const { code } = req.body

    const off = await offModel.findOneAndUpdate(
      {
        code,
        $expr: { $lt: ["$uses", "$max"] },
        usedBy: { $ne: req.user._id }
      },
      {
        $inc: { uses: 1 },
        $push: { usedBy: req.user._id }
      },
      { new: true }
    ).populate("course")

    if (!off) {
      return next({
        status: 400,
        message: "Invalid, expired, or already used discount code"
      });
    }

    const discountedPrice = off.course.price * (1 - off.percent / 100);

    res.status(200).json({
      message: "Discount applied successfully",
      discountedPrice
    });

  } catch (err) {
    next(err);
  }
};

