const menuModel = require("../models/menu");
// Get All Menus// 
exports.get = async (req, res, next) => {
    try {
        const menus = await menuModel.find({}).lean();
        const map = {};
        const tree = [];

        menus.forEach(menu => {
            map[menu._id] = { ...menu, children: [] };
        });

        menus.forEach(menu => {
            const currentItem = map[menu._id];
            const parentId = menu.parent;

            if (parentId && map[parentId]) {
                map[parentId].children.push(currentItem);
            } else {
                tree.push(currentItem);
            }
        });

        res.status(200).json(tree);
    } catch (err) {
        next(err);
    }
};

//  Get One Menu// 
exports.getOne = async (req, res, next) => {
    try {
        const menu = await menuModel.findById(req.params.id).lean();
        if (!menu) return res.status(404).json({ message: "Menu not found" });

        const subMenus = await menuModel.find({ parent: menu._id }).lean();

        res.status(200).json({
            menu,
            subMenus
        });
    } catch (err) {
        next(err);
    }
};

// Create Menu// 
exports.post = async (req, res, next) => {
    try {
        const newMenu = await menuModel.create(req.parsed.data);
        res.status(201).json(newMenu);
    } catch (err) {
        next(err);
    }
};

//  Update Menu// 
exports.patch = async (req, res, next) => {
    try {
        const updatedMenu = await menuModel.findByIdAndUpdate(
            req.params.id,
            req.parsed.data,
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
        const deletedMenu = await menuModel.findByIdAndDelete(req.params.id);
        if (!deletedMenu)
            return res.status(404).json({ message: "Menu not found" });

        res.status(200).json({ message: "Deleted successfully" });
    } catch (err) {
        next(err);
    }
};
