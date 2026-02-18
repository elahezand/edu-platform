const articleModel = require("../models/article");
const {
  createArticleSchema,
  updateArticleSchema,
  idParamSchema
} = require("../validators/article");

const { paginate } = require("../utils/helper");

/* Get Articles*/
exports.get = async (req, res, next) => {
  try {
    const searchParams = new URLSearchParams(req.query);
    const useCursor = searchParams.has("cursor");

    const result = await paginate(
      articleModel,
      searchParams,
      {},
      "creator",
      useCursor,
      true
    );

    res.status(200).json({ articles: result });
  } catch (err) {
    next(err);
  }
};

/*   Get One Article*/
exports.getOne = async (req, res, next) => {
  try {
    const parsed = idParamSchema.safeParse(req.params);
    if (!parsed.success)
      return next({ status: 422, message: "Invalid ID" });

    const article = await articleModel
      .findById(parsed.data.id)
      .populate("creator")
      .lean();

    if (!article)
      return next({ status: 404, message: "Article not found" });

    res.status(200).json(article);
  } catch (err) {
    next(err);
  }
};

/* Create Article*/
exports.post = async (req, res, next) => {
  try {
    const parsed = createArticleSchema.safeParse(req.body);
    if (!parsed.success)
      return next({
        status: 422,
        message: "Invalid data",
        errors: parsed.error.issues
      });

    if (!req.file)
      return next({ status: 400, message: "Cover image is required" });

    const existing = await articleModel.findOne({ title: parsed.data.title });
    if (existing)
      return next({ status: 409, message: "Article already exists" });

    const cover = `/articles/covers/${req.file.filename}`;

    const article = await articleModel.create({
      ...parsed.data,
      cover,
      creator: req.admin._id
    });

    res.status(201).json({
      message: "Article created successfully",
      article
    });

  } catch (err) {
    next(err);
  }
};

/* Update Article*/
exports.patch = async (req, res, next) => {
  try {
    const idParsed = idParamSchema.safeParse(req.params);
    if (!idParsed.success)
      return next({ status: 422, message: "Invalid ID" });

    const bodyParsed = updateArticleSchema.safeParse(req.body);
    if (!bodyParsed.success)
      return next({
        status: 422,
        message: "Invalid data",
        errors: bodyParsed.error.issues
      });

    const article = await articleModel.findById(idParsed.data.id);
    if (!article)
      return next({ status: 404, message: "Article not found" });

    const updateData = {
      ...bodyParsed.data
    };

    if (req.file)
      updateData.cover = `/articles/covers/${req.file.filename}`;

    const updated = await articleModel.findByIdAndUpdate(
      idParsed.data.id,
      { $set: updateData },
      { new: true }
    );

    res.status(200).json({
      message: "Article updated successfully",
      article: updated
    });

  } catch (err) {
    next(err);
  }
};

/* Delete Article*/
exports.remove = async (req, res, next) => {
  try {
    const parsed = idParamSchema.safeParse(req.params);
    if (!parsed.success)
      return next({ status: 422, message: "Invalid ID" });

    const deleted = await articleModel.findByIdAndDelete(parsed.data.id);
    if (!deleted)
      return next({ status: 404, message: "Article not found" });

    res.status(200).json({ message: "Article deleted successfully" });

  } catch (err) {
    next(err);
  }
};
