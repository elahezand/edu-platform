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

/* Get All Courses */
exports.getAll = async (req, res, next) => {
  try {
    const searchParams = new URLSearchParams(req.query);
    const useCursor = searchParams.has("cursor");

    const result = await paginate(
      courseModel,
      searchParams,
      {},
      null,
      useCursor,
      true
    );

    res.status(200).json({ courses: result });

  } catch (err) {
    next(err);
  }
};

/* Get Popular */
exports.getPopular = async (req, res, next) => {
  try {
    const searchParams = new URLSearchParams(req.query);
    const useCursor = searchParams.has("cursor");

    const result = await paginate(
      courseModel,
      searchParams,
      { rating: { $gt: 4 } },
      null,
      useCursor,
      true
    );

    res.status(200).json({ courses: result });

  } catch (err) {
    next(err);
  }
}
/*Get Courses By Category*/
exports.getCategoryCourses = async (req, res, next) => {
  try {
    const searchParams = new URLSearchParams(req.query);
    const useCursor = searchParams.has("cursor");;
    const { categoryName } = req.params;

    if (typeof categoryName !== 'string' || !categoryName) {
      return next({ status: 400, message: "Invalid category name" });
    }
    const category = await categoryModel.findOne({ name: String(categoryName).trim() }).lean();

    if (!category) return res.status(200).json([]);

    const result = await paginate(
      courseModel,
      searchParams,
      { category: category._id },
      "instructor category",
      useCursor,
      true
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
};

/* Get Related Courses */
exports.getRelated = async (req, res, next) => {
  try {
    const { shortName } = req.params;

    const course = await courseModel.findOne({ slug: String(shortName) }).lean();
    if (!course) return res.status(404).json({ message: "Course not found" });

    const relatedCourses = await courseModel
      .find({
        category: course.category,
        _id: { $ne: course._id }
      })
      .limit(4)
      .lean();

    res.json(relatedCourses);
  } catch (error) {
    next(error);
  }
};

/*Get One Course*/
exports.getOne = async (req, res, next) => {
  try {
    const parsed = courseIdParamSchema.safeParse(req.params);
    if (!parsed.success) return next({ status: 422, message: "Invalid ID" });

    const course = await courseModel.findById(parsed.data.id)
      .populate("instructor", "name")
      .populate("category", "title")
      .lean();

    if (!course) return next({ status: 404, message: "Course not found" });

    const [courseRegisters, courseComments] = await Promise.all([
      courseUserModel.countDocuments({ course: course._id }),
      commentModel.find({ course: course._id }).lean()
    ]);

    const totalScore = courseComments.reduce((acc, curr) => acc + (curr.score || 0), 0);
    const avgScore = courseComments.length > 0 ? Math.round(totalScore / courseComments.length) : 5;

    let isUserRegistered = false;
    if (req.user) {
      isUserRegistered = !!(await courseUserModel.findOne({
        user: req.user._id,
        course: course._id,
      }));
    }

    res.status(200).json({
      ...course,
      instructor: course.instructor?.name,
      category: course.category?.title,
      registers: courseRegisters,
      courseAverageScore: avgScore,
      isUserRegisteredToThisCourse: isUserRegistered,
    });
  } catch (err) {
    next(err);
  }
};
/* Create Course*/
exports.post = async (req, res, next) => {
  try {
    const courseData = {
      ...req.body,
      price: Number(req.body.price),
      discount: Number(req.body.discount),
      rating: Number(req.body.rating),
      coverImage: req.file ? req.file.filename : undefined
    };
    const parsed = createCourseSchema.safeParse(courseData);
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

/* Update Course*/
exports.patch = async (req, res, next) => {
  try {
    const idParsed = courseIdParamSchema.safeParse(req.params);
    if (!idParsed.success)
      return next({ status: 422, message: "Invalid ID" });

    const courseData = {
      ...req.body,
      price: Number(req.body.price),
      discount: Number(req.body.discount),
      rating: Number(req.body.rating),
      coverImage: req.file ? req.file.filename : undefined
    };
    const parsed = updateCourseSchema.safeParse(courseData);
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

/* Delete Course */
exports.remove = async (req, res, next) => {
  try {
    const parsed = courseIdParamSchema.safeParse(req.params);
    if (!parsed.success) return next({ status: 422, message: "Invalid ID" });

    const deleted = await courseModel.findByIdAndDelete(parsed.data.id);
    if (!deleted) return next({ status: 404, message: "Course not found" });

    res.status(200).json({ message: "Course deleted successfully" });

  } catch (err) {
    next(err);
  }
};

/* Register User To Course*/
exports.register = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { price } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Course ID" });
    }

    const isUserAlreadyRegistered = await courseUserModel.findOne({
      user: req.user._id,
      course: String(id)
    }).lean();

    if (isUserAlreadyRegistered) {
      return res.status(400).json({ message: "You are already registered." });
    }

    await courseUserModel.create({
      user: req.user._id,
      course: String(id),
      price: Number(price) || 0,
    });

    return res.status(201).json({ message: "Registered successfully." });
  } catch (error) {
    next(error);
  }
};