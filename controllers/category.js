const categoryModel = require("../models/category");
const {
  createCategorySchema,
  updateCategorySchema,
  categoryIdParamSchema,
} = require("../validators/category");

const { paginate } = require("../utils/helper");

/* ==============================
   Get Categories
============================== */
exports.get = async (req, res, next) => {
  try {
    const { searchParams } = new URL(
      req.protocol + "://" + req.get("host") + req.originalUrl
    );

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

/* ==============================
   Create Category
============================== */
exports.post = async (req, res, next) => {
  try {
    if (!req.admin)
      return next({ status: 403, message: "Forbidden" });

    const parsed = createCategorySchema.safeParse(req.body);
    if (!parsed.success)
      return next({
        status: 422,
        message: "Invalid data",
        errors: parsed.error.flatten().fieldErrors,
      });

    const exists = await categoryModel.findOne({ name: parsed.data.name });
    if (exists)
      return next({ status: 409, message: "Category already exists" });

    const category = await categoryModel.create(parsed.data);

    res.status(201).json({
      message: "Category created successfully",
      category,
    });

  } catch (err) {
    next(err);
  }
};

/* ==============================
   Update Category
============================== */
exports.patch = async (req, res, next) => {
  try {
    if (!req.admin)
      return next({ status: 403, message: "Forbidden" });

    const paramParsed = categoryIdParamSchema.safeParse(req.params);
    if (!paramParsed.success)
      return next({ status: 422, message: "Invalid ID" });

    const bodyParsed = updateCategorySchema.safeParse(req.body);
    if (!bodyParsed.success)
      return next({
        status: 422,
        message: "Invalid data",
        errors: bodyParsed.error.flatten().fieldErrors,
      });

    if (bodyParsed.data.name) {
      const exists = await categoryModel.findOne({
        name: bodyParsed.data.name,
        _id: { $ne: paramParsed.data.id }
      });
      if (exists)
        return next({ status: 409, message: "Category name already exists" });
    }

    const updated = await categoryModel.findByIdAndUpdate(
      paramParsed.data.id,
      { $set: bodyParsed.data },
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

/* ==============================
   Delete Category
============================== */
exports.remove = async (req, res, next) => {
  try {
    if (!req.admin)
      return next({ status: 403, message: "Forbidden" });

    const parsed = categoryIdParamSchema.safeParse(req.params);
    if (!parsed.success)
      return next({ status: 422, message: "Invalid ID" });

    const deleted = await categoryModel.findByIdAndDelete(parsed.data.id);

    if (!deleted)
      return next({ status: 404, message: "Category not found" });

    res.status(200).json({
      message: "Category deleted successfully",
    });

  } catch (err) {
    next(err);
  }
};
