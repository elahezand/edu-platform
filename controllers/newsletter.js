const newsletterModel = require("../models/newsletter");
const createNewsletterSchema = require("../validators/newsLetter")
const { paginate } = require("../utils/helper");

// GET all newsletters (admin)
exports.getAll = async (req, res, next) => {
    try {
        const searchParams = new URLSearchParams(req.query);
        const useCursor = searchParams.has("cursor");

        const result = await paginate(
            newsletterModel,
            searchParams,
            {},
            null,
            useCursor,
            true
        );
        res.status(200).json(result);
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
