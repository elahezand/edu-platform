const offModel = require("../models/off");
const { createOffSchema, updateOffSchema } = require("../validators/off");

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

/* 
   Get One Off
 */
exports.getOne = async (req, res, next) => {
  try {
    const off = await offModel.findById(req.params.id)
      .populate("course", "title")
      .populate("creator", "name")
      .lean();

    if (!off) return next({ status: 404, message: "Off not found" });

    res.status(200).json(off);
  } catch (err) {
    next(err);
  }
};

/*  Create Off*/
exports.post = async (req, res, next) => {
  try {
    const parsed = createOffSchema.safeParse(req.body);
    if (!parsed.success)
      return next({ status: 422, message: "Invalid data", errors: parsed.error.issues });

    const newOff = await offModel.create({
      ...parsed.data,
      creator: req.user._id
    });

    res.status(201).json({ message: "Off created successfully", off: newOff });
  } catch (err) {
    next(err);
  }
};

/* 
   Update Off
 */
exports.patch = async (req, res, next) => {
  try {
    const parsed = updateOffSchema.safeParse(req.body);
    if (!parsed.success)
      return next({ status: 422, message: "Invalid data", errors: parsed.error.issues });

    const updatedOff = await offModel.findByIdAndUpdate(
      req.params.id,
      parsed.data,
      { new: true }
    );

    if (!updatedOff) return next({ status: 404, message: "Off not found" });

    res.status(200).json({ message: "Off updated successfully", off: updatedOff });
  } catch (err) {
    next(err);
  }
};

/*   Delete Off*/
exports.remove = async (req, res, next) => {
  try {
    const deleted = await offModel.findByIdAndDelete(req.params.id);
    if (!deleted) return next({ status: 404, message: "Off not found" });

    res.status(200).json({ message: "Off deleted successfully" });
  } catch (err) {
    next(err);
  }
};
