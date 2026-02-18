const infoModel = require("../models/info");
const {
    createInfoSchema,
    updateInfoSchema,
} = require("../validators/info");

/* Get Info (Public)*/
exports.get = async (req, res, next) => {
    try {
        const info = await infoModel.findOne().lean();
        res.status(200).json(info || null);
    } catch (err) {
        next(err);
    }
};

/* Create (Only if not exists)*/
exports.post = async (req, res, next) => {

    try {
        const parsed = createInfoSchema.safeParse(req.body);
        if (!parsed.success)
            return next({ status: 422, message: parsed.error.message });

        const exists = await infoModel.findOne();
        if (exists)
            return next({ status: 409, message: "Info already exists" });

        const info = await infoModel.create(parsed.data);
        res.status(201).json(info);
    } catch (err) {
        next(err);
    }
};

/*  Update Singleton*/
exports.patch = async (req, res, next) => {
    try {

        const parsed = updateInfoSchema.safeParse(req.body);
        if (!parsed.success)
            return next({ status: 422, message: parsed.error.message });

        const info = await infoModel.findOneAndUpdate(
            req.params.id,
            { $set: parsed.data },
            { new: true, upsert: true }
        );

        res.status(200).json(info);
    } catch (err) {
        next(err);
    }
};

/*  Delete*/
exports.remove = async (req, res, next) => {
    try {
        const deleted = await infoModel.findByIdAndDelete(req.params.id);
        if (!deleted)
            return next({ status: 404, message: "Info not found" });

        res.status(200).json({ message: "Deleted successfully" });
    } catch (err) {
        next(err);
    }
};
