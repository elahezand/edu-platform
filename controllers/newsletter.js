const newsletterModel = require("../models/newsletter");
const createNewsletterSchema = require("../validators/newsLetter")

// GET all newsletters (admin)
exports.getAll = async (req, res, next) => {
    try {
        if (!req.admin)
            return next({ status: 403, message: "Forbidden" });

        const newsletters = await newsletterModel.find().lean();
        res.status(200).json(newsletters);
    } catch (err) {
        next(err);
    }
};

// POST create new newsletter
exports.post = async (req, res, next) => {
    try {

        const parsed = createNewsletterSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(422).json({ errors: parsed.error.issues });
        }
        const exists = await newsletterModel.findOne({ email: parsed.data.email });
        if (exists) {
            return res.status(409).json({ message: "Email already subscribed" });
        }

        const newsletter = await newsletterModel.create({ email: parsed.data.email });
        res.status(201).json({ message: "Subscribed successfully", newsletter });
    } catch (err) {
        next(err);
    }
};
