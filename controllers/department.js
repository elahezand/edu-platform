const departmentModel = require("../models/department");


/* Get All (with parent)*/
exports.get = async (req, res, next) => {
    try {
        const departments = await departmentModel
            .find()
            .populate("parent", "title")
            .lean();

        res.status(200).json(departments);
    } catch (err) {
        next(err);
    }
};

/* Get One (with parent + children)*/
exports.getOne = async (req, res, next) => {
    try {
        const department = await departmentModel
            .findById(req.params.id)
            .populate("parent")
            .lean();

        if (!department)
            return next({ status: 404, message: "Department not found" });

        const children = await departmentModel
            .find({ parent: department._id })
            .lean();

        res.status(200).json({
            ...department,
            children,
        });

    } catch (err) {
        next(err);
    }
};

/* Create (supports parent)*/
exports.post = async (req, res, next) => {
    try {
    
        const department = await departmentModel.create({
            title: req.parsed.data.title,
            parent: req.parsed.data.parent || null,
        });

        res.status(201).json(department);
    } catch (err) {
        next(err);
    }
};

/* Update (title + parent)*/
exports.patch = async (req, res, next) => {
    try {
        const department = await departmentModel.findByIdAndUpdate(
            req.params.id,
            {
                title: req.parsed.data.title,
                parent: req.parsed.data.parent ?? null,
            },
            { new: true }
        );

        if (!department)
            return next({ status: 404, message: "Department not found" });

        res.status(200).json(department);

    } catch (err) {
        next(err);
    }
};

/*Delete (prevent if has children)*/
exports.remove = async (req, res, next) => {
    try {
        const hasChildren = await departmentModel.exists({
            parent: req.params.id,
        });

        if (hasChildren)
            return next({
                status: 400,
                message: "Cannot delete department with sub-departments",
            });

        const department = await departmentModel.findByIdAndDelete(req.params.id);

        if (!department)
            return next({ status: 404, message: "Department not found" });

        res.status(200).json({ message: "Deleted successfully" });

    } catch (err) {
        next(err);
    }
};
