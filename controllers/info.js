const infoModel = require("../models/info");

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
        const exists = await infoModel.findOne();
        if (exists)
            return next({ status: 409, message: "Info already exists" });

        const info = await infoModel.create(req.parsed.data);
        res.status(201).json(info);
    } catch (err) {
        next(err);
    }
};

/*  Update Singleton*/
exports.patch = async (req, res, next) => {
    try {
        const info = await infoModel.findOneAndUpdate(
            { _id: req.params.id },
            { $set: req.parsed.data },
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
