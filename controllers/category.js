const categoryModel = require("../models/category");
const { paginate } = require("../utils/helper");

/*  Get Categories*/
exports.get = async (req, res, next) => {
  try {
    const searchParams = new URLSearchParams(req.query);
    const useCursor = searchParams.has("cursor");

    const result = await paginate(
      categoryModel,
      searchParams,
      {},
      null,
      useCursor,
      true
    );

    res.status(200).json({ categories: result });

  } catch (err) {
    next(err);
  }
};

/* Create Category*/
exports.post = async (req, res, next) => {
  try {
    const exists = await categoryModel.findOne({ name: req.parsed.data.name });
    if (exists)
      return next({ status: 409, message: "Category already exists" });

    const category = await categoryModel.create(req.parsed.data);

    res.status(201).json({
      message: "Category created successfully",
      category,
    });

  } catch (err) {
    next(err);
  }
};

/* Update Category*/
exports.patch = async (req, res, next) => {
  try {

    if (req.parsed.data.name) {
      const exists = await categoryModel.findOne({
        name: req.parsed.data.name,
        _id: { $ne: req.params.id }
      });
      if (exists)
        return next({ status: 409, message: "Category name already exists" });
    }

    const updated = await categoryModel.findByIdAndUpdate(
      req.params.id,
      { $set: req.parsed.data },
      { new: true }
    );

    if (!updated)
      return next({ status: 404, message: "Category not found" });

    res.status(200).json({
      message: "Category updated successfully",
      category: updated,
    });

  } catch (err) {
    next(err);
  }
};

/* Delete Category*/
exports.remove = async (req, res, next) => {
  try {
    const deleted = await categoryModel.findByIdAndDelete(req.params.id);

    if (!deleted)
      return next({ status: 404, message: "Category not found" });

    res.status(200).json({
      message: "Category deleted successfully",
    });

  } catch (err) {
    next(err);
  }
};
