const commentModel = require("../models/comment");
const courseModel = require("../models/course");
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
    const course = await courseModel.findById(req.parsed.data.course);
    if (!course)
      return next({ status: 404, message: "Course not found" });

    await commentModel.create({
      ...req.parsed.data,
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

    const updated = await commentModel.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          answers: {
            text: req.parsed.data.text,
            admin: req.user._id,
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
    const comment = await commentModel.findById(req.params.id);
    if (!comment) return next({ status: 404, message: "Comment not found" });
    comment.isAccept = !comment.isAccept;
    await comment.save();

    res.status(200).json({ message: `Comment ${comment.isAccept ? 'accepted' : 'rejected'}` });
  } catch (err) {
    next(err);
  }
};
/* Update Comment (Admin)*/
exports.patch = async (req, res, next) => {
  try {
    const updated = await commentModel.findByIdAndUpdate(
      req.params.id,
      { $set: { body: req.parsed.data.body } },
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
    const deleted = await commentModel.findByIdAndDelete(req.params.id);
    if (!deleted)
      return next({ status: 404, message: "Comment not found" });

    res.status(200).json({ message: "Comment removed successfully" });
  } catch (err) {
    next(err);
  }
};
