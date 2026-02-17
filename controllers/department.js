const departmentModel = require("../models/department");

const {
    createDepartmentSchema,
    updateDepartmentSchema,
    departmentIdParamSchema,
} = require("../validators/department");

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
        const parsed = departmentIdParamSchema.safeParse(req.params);
        if (!parsed.success)
            return next({ status: 422, message: "Invalid ID" });

        const department = await departmentModel
            .findById(parsed.data.id)
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
        if (!req.admin)
            return next({ status: 403, message: "Forbidden" });

        const parsed = createDepartmentSchema.safeParse(req.body);
        if (!parsed.success)
            return next({ status: 422, message: parsed.error.message });

        const department = await departmentModel.create({
            title: parsed.data.title,
            parent: parsed.data.parent || null,
        });

        res.status(201).json(department);
    } catch (err) {
        next(err);
    }
};

/* Update (title + parent)*/
exports.patch = async (req, res, next) => {
    try {
        if (!req.admin)
            return next({ status: 403, message: "Forbidden" });

        const parsedId = departmentIdParamSchema.safeParse(req.params);
        if (!parsedId.success)
            return next({ status: 422, message: "Invalid ID" });

        const parsed = updateDepartmentSchema.safeParse({
            id: req.params.id,
            ...req.body,
        });

        if (!parsed.success)
            return next({ status: 422, message: parsed.error.message });

        const department = await departmentModel.findByIdAndUpdate(
            parsed.data.id,
            {
                title: parsed.data.title,
                parent: parsed.data.parent ?? null,
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

        if (!req.admin)
            return next({ status: 403, message: "Forbidden" });

        const parsed = departmentIdParamSchema.safeParse(req.params);
        if (!parsed.success)
            return next({ status: 422, message: "Invalid ID" });

        const hasChildren = await departmentModel.exists({
            parent: parsed.data.id,
        });

        if (hasChildren)
            return next({
                status: 400,
                message: "Cannot delete department with sub-departments",
            });

        const department = await departmentModel.findByIdAndDelete(parsed.data.id);

        if (!department)
            return next({ status: 404, message: "Department not found" });

        res.status(200).json({ message: "Deleted successfully" });

    } catch (err) {
        next(err);
    }
};
