const sessionModel = require("../models/session");
const courseModel = require("../models/course");
const {
  createSessionSchema,
  updateSessionSchema,
  sessionIdParamSchema
} = require("../validators/session");
const { paginate } = require("../utils/helper");

/*  Get All Sessions (Admin)  */
exports.get = async (req, res, next) => {
  try {
    const searchParams = new URLSearchParams(req.query);
    const useCursor = searchParams.has("cursor");

    const result = await paginate(
      sessionModel,
      searchParams,
      {},
      null,
      useCursor,
      true
    );

    res.status(200).json({ sessions: result });

  } catch (err) {
    next(err);
  }
};

/*  Get One Session  */
exports.getOne = async (req, res, next) => {
  try {
    const parsed = sessionIdParamSchema.safeParse(req.params);
    if (!parsed.success)
      return next({ status: 422, message: "Invalid ID" });

    const session = await sessionModel.findById(parsed.data.id).lean();
    if (!session)
      return next({ status: 404, message: "Session not found" });

    res.status(200).json(session);

  } catch (err) {
    next(err);
  }
};

/*  Create Session (Admin)  */
exports.post = async (req, res, next) => {
  try {
    const parsed = createSessionSchema.safeParse(req.body);
    if (!parsed.success)
      return next({
        status: 422,
        message: "Invalid data",
        errors: parsed.error.issues
      });

    const { title, course } = parsed.data;

    const exists = await sessionModel.findOne({ title, course });
    if (exists)
      return next({ status: 409, message: "Session already exists" });

    const videoUrl = req.file
      ? `/session/videos/${req.file.filename}`
      : parsed.data.videoUrl || "";

    const newSession = await sessionModel.create({
      ...parsed.data,
      videoUrl
    });

    res.status(201).json({
      message: "Session created successfully",
      session: newSession
    });

  } catch (err) {
    next(err);
  }
};

/*  Update Session (Admin)  */
exports.patch = async (req, res, next) => {
  try {
    const idParsed = sessionIdParamSchema.safeParse(req.params);
    if (!idParsed.success)
      return next({ status: 422, message: "Invalid ID" });

    const parsed = updateSessionSchema.safeParse(req.body);
    if (!parsed.success)
      return next({
        status: 422,
        message: "Invalid data",
        errors: parsed.error.issues
      });

    const session = await sessionModel.findById(idParsed.data.id);
    if (!session)
      return next({ status: 404, message: "Session not found" });

    const videoUrl = req.file
      ? `/session/videos/${req.file.filename}`
      : session.videoUrl;

    const updated = await sessionModel.findByIdAndUpdate(
      idParsed.data.id,
      { $set: { ...parsed.data, videoUrl } },
      { new: true }
    );

    res.status(200).json({
      message: "Session updated successfully",
      session: updated
    });

  } catch (err) {
    next(err);
  }
};

/*  Delete Session (Admin)  */
exports.remove = async (req, res, next) => {
  try {
    const parsed = sessionIdParamSchema.safeParse(req.params);
    if (!parsed.success)
      return next({ status: 422, message: "Invalid ID" });

    const deleted = await sessionModel.findByIdAndDelete(parsed.data.id);
    if (!deleted)
      return next({ status: 404, message: "Session not found" });

    res.status(200).json({ message: "Session deleted successfully" });

  } catch (err) {
    next(err);
  }
};

/*  Get Sessions by Course  */
exports.getSessionCourse = async (req, res, next) => {
  try {
    const searchParams = new URLSearchParams(req.query);
    const useCursor = searchParams.has("cursor");
    const shortName = String(req.params.shortName);

    const course = await courseModel.findOne({ shortName }).lean();

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    const result = await paginate(
      sessionModel,
      searchParams,
      { course: course._id },
      null,
      useCursor,
      true
    );

    return res.status(200).json({ sessions: result });

  } catch (err) {
    next(err);
  }
};