const courseModel = require("../models/course");
const articleModel = require("../models/article");
const sessionModel = require("../models/session");

exports.search = async (req, res, next) => {
  try {
    const q = String(req.query.q || "").trim();

    if (!q) {
      return res.status(400).json({
        message: "Query is required"
      });
    }

    const regex = new RegExp(q, "i");

    const [courses, articles, sessions] = await Promise.all([
      courseModel
        .find({ title: regex, isActive: true })
        .select("title slug coverImage")
        .limit(5)
        .lean(),

      articleModel
        .find({ title: regex, publish: true })
        .select("title shortName")
        .limit(5)
        .lean(),

      sessionModel
        .find({ title: regex })
        .select("title course")
        .limit(5)
        .lean(),
    ]);

    res.status(200).json({
      courses,
      articles,
      sessions,
    });

  } catch (err) {
    next(err);
  }
};
