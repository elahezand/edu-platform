const courseModel = require("../models/course");
const categoryModel = require("../models/category");
const courseUserModel = require("../models/course-user");
const {
  createCourseSchema,
  updateCourseSchema,
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
    const [course] = await courseModel.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(req.params.id) } },
      { $lookup: { from: "users", localField: "instructor", foreignField: "_id", as: "instructor" } },
      { $unwind: "$instructor" },
      { $lookup: { from: "categories", localField: "category", foreignField: "_id", as: "category" } },
      { $unwind: "$category" },
      { $lookup: { from: "courseusers", localField: "_id", foreignField: "course", as: "registers" } },
      { $lookup: { from: "comments", localField: "_id", foreignField: "course", as: "comments" } },
      {
        $addFields: {
          registersCount: { $size: "$registers" },
          registeredUserIds: "$registers.user",
          courseAverageScore: { $cond: [{ $gt: [{ $size: "$comments" }, 0] }, { $round: [{ $avg: "$comments.score" }, 0] }, 5] },
          isUserRegisteredToThisCourse: userId ? { $in: [new mongoose.Types.ObjectId(userId), "$registeredUserIds"] } : false
        }
      },
      {
        $project: {
          registers: 0,
          comments: 0,
          registeredUserIds: 0
        }
      }
    ]);

    if (!course) return next({ status: 404, message: "Course not found" });
    res.status(200).json(course);
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


    const course = await courseModel.findById(req.params.id);
    if (!course) return next({ status: 404, message: "Course not found" });

    const coverImage = req.file ? `/course/covers/${req.file.filename}` : course.coverImage;

    const updated = await courseModel.findByIdAndUpdate(
      req.params.id,
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
    const deleted = await courseModel.findByIdAndDelete(req.params.id);
    if (!deleted) return next({ status: 404, message: "Course not found" });

    res.status(200).json({ message: "Course deleted successfully" });

  } catch (err) {
    next(err);
  }
};

/* Register User To Course*/
exports.register = async (req, res, next) => {
  try {
    const mainCourse = await courseModel.findById(req.params.id)
if (!mainCourse) {
      return res.status(400).json({ message: "NOT FOUND." });
    }
    const isUserAlreadyRegistered = await courseUserModel.findOne({
      user: req.user._id,
      course: req.params.id
    }).lean();

    if (isUserAlreadyRegistered) {
      return res.status(400).json({ message: "You are already registered." });
    }
   
    await courseUserModel.create({
      user: req.user._id,
      course: String(req.params.id),
      price: mainCourse.price,
    });

    return res.status(201).json({ message: "Registered successfully." });
  } catch (error) {
    next(error);
  }
};