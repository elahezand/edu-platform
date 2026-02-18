const commentModel = require("../models/comment");
const courseModel = require("../models/course");
const {
  createCommentSchema,
  answerCommentSchema,
  updateCommentSchema,
  commentIdParamSchema,
} = require("../validators/comment");

const { paginate } = require("../utils/helper");

/* Get Comments*/
exports.get = async (req, res, next) => {
  try {
    const searchParams = new URLSearchParams(req.query);
    const useCursor = searchParams.has("cursor");
    const course = searchParams.get("course");

    const result = await paginate(
      commentModel,
      searchParams,
      course ? { course } : {},
      "user",
      useCursor,
      true
    );

    res.status(200).json({ comments: result });
  } catch (err) {
    next(err);
  }
};

/* Create Comment (User)*/
exports.post = async (req, res, next) => {
  try {
    const parsed = createCommentSchema.safeParse(req.body);

    if (!parsed.success)
      return next({
        status: 422,
        message: "Invalid data",
        errors: parsed.error.issues,
      });

    const course = await courseModel.findById(parsed.data.course);
    if (!course)
      return next({ status: 404, message: "Course not found" });

    await commentModel.create({
      ...parsed.data,
      user: req.user._id,
    });

    res.status(201).json({ message: "Comment sent successfully" });
  } catch (err) {
    next(err);
  }
};

/* Answer Comment (Admin)*/
exports.answer = async (req, res, next) => {
  try {

    const paramParsed = commentIdParamSchema.safeParse(req.params);
    if (!paramParsed.success)
      return next({ status: 422, message: "Invalid ID" });

    const bodyParsed = answerCommentSchema.safeParse(req.body);
    if (!bodyParsed.success)
      return next({
        status: 422,
        message: "Invalid data",
        errors: bodyParsed.error.issues,
      });

    const updated = await commentModel.findByIdAndUpdate(
      paramParsed.data.id,
      {
        $push: {
          answers: {
            text: bodyParsed.data.text,
            admin: req.admin._id,
            createdAt: new Date(),
          },
        },
      },
      { new: true }
    );

    if (!updated)
      return next({ status: 404, message: "Comment not found" });

    res.status(200).json({ message: "Answer added successfully" });
  } catch (err) {
    next(err);
  }
};

/* Accept Comment (Admin)*/
exports.accept = async (req, res, next) => {
  try {
    const parsed = commentIdParamSchema.safeParse(req.params);
    if (!parsed.success)
      return next({ status: 422, message: "Invalid ID" });

    const comment = await commentModel.findById(parsed.data.id);
    if (!comment)
      return next({ status: 404, message: "Comment not found" });

    comment.isAccept = !comment.isAccept;
    await comment.save();

    res.status(200).json({ message: "Comment status changed" });
  } catch (err) {
    next(err);
  }
};

/* Update Comment (Admin)*/
exports.patch = async (req, res, next) => {
  try {
    const paramParsed = commentIdParamSchema.safeParse(req.params);
    if (!paramParsed.success)
      return next({ status: 422, message: "Invalid ID" });

    const bodyParsed = updateCommentSchema.safeParse(req.body);
    if (!bodyParsed.success)
      return next({
        status: 422,
        message: "Invalid data",
        errors: bodyParsed.error.issues,
      });

    const updated = await commentModel.findByIdAndUpdate(
      paramParsed.data.id,
      { $set: { body: bodyParsed.data.body } },
      { new: true }
    );

    if (!updated)
      return next({ status: 404, message: "Comment not found" });

    res.status(200).json({ message: "Comment updated successfully" });
  } catch (err) {
    next(err);
  }
};

/* Delete Comment (Admin)*/
exports.remove = async (req, res, next) => {
  try {
    const parsed = commentIdParamSchema.safeParse(req.params);
    if (!parsed.success)
      return next({ status: 422, message: "Invalid ID" });

    const deleted = await commentModel.findByIdAndDelete(parsed.data.id);
    if (!deleted)
      return next({ status: 404, message: "Comment not found" });

    res.status(200).json({ message: "Comment removed successfully" });
  } catch (err) {
    next(err);
  }
};
