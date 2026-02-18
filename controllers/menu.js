const menuModel = require("../models/menu");
const { menuIdParamSchema, updateMenuSchema, createMenuSchema } = require("../validators/menu");
// Get All Menus// 
exports.get = async (req, res, next) => {
    try {
        const menus = await menuModel.find().lean();
        res.status(200).json(menus);
    } catch (err) {
        next(err);
    }
};

//  Get One Menu// 
exports.getOne = async (req, res, next) => {
    try {
        const parsedId = menuIdParamSchema.safeParse(req.params);
        if (!parsedId.success)
            return next({ status: 422, message: "Invalid ID" });

        const menu = await menuModel.findById(req.params.id).lean();
        if (!menu) return res.status(404).json({ message: "Menu not found" });

        res.status(200).json(menu);
    } catch (err) {
        next(err);
    }
};

// Create Menu// 
exports.post = async (req, res, next) => {
    try {
        const parsed = createMenuSchema.safeParse(req.body);
        if (!parsed.success)
            return res.status(422).json({ message: parsed.error.issues });

        const newMenu = await menuModel.create(parsed.data);
        res.status(201).json(newMenu);
    } catch (err) {
        next(err);
    }
};

//  Update Menu// 
exports.patch = async (req, res, next) => {
    try {
        const parsedId = menuIdParamSchema.safeParse(req.params);
        if (!parsedId.success)
            return next({ status: 422, message: "Invalid ID" });

        const parsed = updateMenuSchema.safeParse(req.body);
        if (!parsed.success)
            return res.status(422).json({ message: parsed.error.issues });

        const updatedMenu = await menuModel.findByIdAndUpdate(
            req.params.id,
            parsed.data,
            { new: true }
        );

        if (!updatedMenu)
            return res.status(404).json({ message: "Menu not found" });

        res.status(200).json(updatedMenu);
    } catch (err) {
        next(err);
    }
};

// Delete Menu// 
exports.remove = async (req, res, next) => {
    try {
        const parsedId = menuIdParamSchema.safeParse(req.params);
        if (!parsedId.success)
            return next({ status: 422, message: "Invalid ID" });


        const deletedMenu = await menuModel.findByIdAndDelete(req.params.id);
        if (!deletedMenu)
            return res.status(404).json({ message: "Menu not found" });

        res.status(200).json({ message: "Deleted successfully" });
    } catch (err) {
        next(err);
    }
};
