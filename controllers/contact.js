const contactModel = require("../models/contact");
const {
  createContactSchema,
} = require("../validators/contact");
const { paginate } = require("../utils/helper");

/*   Get All Contacts (Admin)*/
exports.get = async (req, res, next) => {
  try {

    const searchParams = new URLSearchParams(req.query);
    const useCursor = searchParams.has("cursor");

    const result = await paginate(
      contactModel,
      searchParams,
      {},
      null,
      useCursor,
      true
    );

    res.status(200).json({ contacts: result });

  } catch (err) {
    next(err);
  }
};

/* Get One Contact (Admin)*/
exports.getOne = async (req, res, next) => {
  try {
    const contact = await contactModel.findById(req.params.id);
    if (!contact)
      return next({ status: 404, message: "Contact not found" });

    res.status(200).json(contact);

  } catch (err) {
    next(err);
  }
};

/*  Create Contact (Public)*/
exports.post = async (req, res, next) => {
  try {
    const parsed = createContactSchema.safeParse(req.body);
    if (!parsed.success)
      return next({
        status: 422,
        message: "Invalid data",
        errors: parsed.error.flatten().fieldErrors,
      });

    const newContact = await contactModel.create(parsed.data);

    res.status(201).json({
      message: "Contact message sent successfully",
      contact: newContact,
    });

  } catch (err) {
    next(err);
  }
};

/*  Delete Contact (Admin)*/
exports.remove = async (req, res, next) => {
  try {
    const deleted = await contactModel.findByIdAndDelete(req.params.id);
    if (!deleted)
      return next({ status: 404, message: "Contact not found" });

    res.status(200).json({ message: "Contact deleted successfully" });

  } catch (err) {
    next(err);
  }
};
