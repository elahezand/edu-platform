const courseModel = require("../models/course");
const categoryModel = require("../models/category");
const courseUserModel = require("../models/course-user");
const commentModel = require("../models/comment");
const {
  createCourseSchema,
  updateCourseSchema,
  courseIdParamSchema,
} = require("../validators/course");
const { paginate } = require("../utils/helper");

/* ==============================
   Get All Courses
============================== */
exports.getAll = async (req, res, next) => {
  try {
    const { searchParams } = new URL(
      req.protocol + "://" + req.get("host") + req.originalUrl
    );

    const useCursor = searchParams.has("cursor");

    const result = await paginate(
      courseModel,
      searchParams,
      {},
      "sessions",
      useCursor,
      true
    );

    res.status(200).json({ courses: result });

  } catch (err) {
    next(err);
  }
};

/* ==============================
   Get One Course
============================== */
exports.getOne = async (req, res, next) => {
  try {
    const parsed = courseIdParamSchema.safeParse(req.params);
    if (!parsed.success)
      return next({ status: 422, message: "Invalid ID" });

    const course = await courseModel.findById(parsed.data.id)
      .populate("creator")
      .populate("categoryID")
      .lean();

    if (!course)
      return next({ status: 404, message: "Course not found" });

    const courseRegisters = await courseUserModel.find({ course: course._id }).lean();
    const courseComments = await commentModel.find({ course: course._id }).lean();

    let courseTotalScore = 5;
    courseComments.forEach(comment => courseTotalScore += Number(comment.score));

    let isUserRegisteredToThisCourse = false;
    if (req.user) {
      isUserRegisteredToThisCourse = !!(await courseUserModel.findOne({
        user: req.user._id,
        course: course._id,
      }));
    }

    const courseInfo = {
      ...course,
      categoryID: course.categoryID.title,
      creator: course.creator.name,
      registers: courseRegisters.length,
      courseAverageScore: Math.floor(courseTotalScore / (courseComments.length + 1)),
      isUserRegisteredToThisCourse,
    };

    res.status(200).json(courseInfo);

  } catch (err) {
    next(err);
  }
};
/* ==============================
   Create Course
============================== */
exports.post = async (req, res, next) => {
  try {
    if (!req.admin) return next({ status: 403, message: "Forbidden" });

    const parsed = createCourseSchema.safeParse(req.body);
    if (!parsed.success)
      return next({ status: 422, message: "Invalid data", errors: parsed.error.issues });

    const existingCourse = await courseModel.findOne({ title: parsed.data.title });
    if (existingCourse)
      return next({ status: 409, message: "Course already exists" });

    if (!req.file)
      return next({ status: 400, message: "Cover image is required" });

    const coverImage = `/course/covers/${req.file.filename}`;

    const newCourse = await courseModel.create({ ...parsed.data, coverImage });

    res.status(201).json({ message: "Course created successfully", course: newCourse });

  } catch (err) {
    next(err);
  }
};

/* ==============================
   Update Course
============================== */
exports.patch = async (req, res, next) => {
  try {
    if (!req.admin) return next({ status: 403, message: "Forbidden" });

    const idParsed = courseIdParamSchema.safeParse(req.params);
    if (!idParsed.success)
      return next({ status: 422, message: "Invalid ID" });

    const parsed = updateCourseSchema.safeParse(req.body);
    if (!parsed.success)
      return next({ status: 422, message: "Invalid data", errors: parsed.error.issues });

    const course = await courseModel.findById(idParsed.data.id);
    if (!course) return next({ status: 404, message: "Course not found" });

    const coverImage = req.file ? `/course/covers/${req.file.filename}` : course.coverImage;

    const updated = await courseModel.findByIdAndUpdate(
      idParsed.data.id,
      { $set: { ...parsed.data, coverImage } },
      { new: true }
    );

    res.status(200).json({ message: "Course updated successfully", course: updated });

  } catch (err) {
    next(err);
  }
};

/* ==============================
   Delete Course
============================== */
exports.remove = async (req, res, next) => {
  try {
    if (!req.admin) return next({ status: 403, message: "Forbidden" });

    const parsed = courseIdParamSchema.safeParse(req.params);
    if (!parsed.success) return next({ status: 422, message: "Invalid ID" });

    const deleted = await courseModel.findByIdAndDelete(parsed.data.id);
    if (!deleted) return next({ status: 404, message: "Course not found" });

    res.status(200).json({ message: "Course deleted successfully" });

  } catch (err) {
    next(err);
  }
};


/* ==============================
   Get Courses By Category
============================== */
exports.getCategoryCourses = async (req, res, next) => {
  try {
    const { categoryName } = req.params;
    const category = await categoryModel.findOne({ name: categoryName });

    if (!category)
      return res.json([]);

    const categoryCourses = await courseModel
      .find({ categoryID: category._id })
      .populate("creator")
      .populate("categoryID")
      .lean();

    res.json(categoryCourses);

  } catch (error) {
    next(error);
  }
};

/* ==============================
   Register User To Course
============================== */
exports.register = async (req, res, next) => {
  try {

    const isUserAlreadyRegistered = await courseUserModel
      .findOne({ user: req.user._id, course: req.params.id })
      .lean();

    if (isUserAlreadyRegistered) {
      return res
        .status(409)
        .json({ message: "you are already registered to this course." });
    }

    await courseUserModel.create({
      user: req.user._id,
      course: req.params.id,
      price: req.body.price,
    });

    return res
      .status(201)
      .json({ message: "you are registered successfully." });
  } catch (error) {
    next(error);
  }
};

/* ==============================
   Get Related Courses
============================== */
exports.getRelated = async (req, res, next) => {
  try {
    const { shortName } = req.params;
    const course = await courseModel.findOne({ shortName });
    let relatedCourses = await courseModel.find({
      categoryID: course.categoryID,
    });
    res.json(relatedCourses.splice(0, 4));
  } catch (error) {
    next(error);
  }
};
