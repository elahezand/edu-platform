const Ticket = require("../models/ticket");
const { paginate } = require("../utils/helper");

/*  Get All Tickets (Admin)*/
exports.getAll = async (req, res, next) => {
  try {
    const searchParams = new URLSearchParams(req.query);
    const useCursor = searchParams.has("cursor");

    const result = await paginate(Ticket, searchParams, {}, null, useCursor, true);

    res.status(200).json({ tickets: result });
  } catch (err) {
    next(err);
  }
};

/* Get My Tickets (User)*/
exports.getMyTickets = async (req, res, next) => {
  try {
    const tickets = await Ticket.find({ user: req.user._id, parent: null })
      .populate("departmentID", "title")
      .populate("course", "title")
      .lean();
    res.status(200).json({ tickets });
  } catch (err) {
    next(err);
  }
};

/*  Get One Ticket + Responses*/
exports.getOne = async (req, res, next) => {
  try {
    const [ticket] = await Ticket.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(req.params.id) } },
      {
        $lookup: {
          from: "tickets",
          localField: "_id",
          foreignField: "parent",
          as: "children"
        }
      }
    ]);

    if (!ticket) return next({ status: 404, message: "Ticket not found" });

    res.status(200).json(ticket);
  } catch (err) {
    next(err);
  }
};

/* Create Ticket (User)*/
exports.create = async (req, res, next) => {
  try {
    const newTicket = await Ticket.create({
      ...req.parsed.data,
      user: req.user._id,
    });

    res.status(201).json({
      message: "Ticket created successfully",
      ticket: newTicket,
    });
  } catch (err) {
    next(err);
  }
};

/* Answer Ticket + Update Main Ticket (Admin)*/
exports.answer = async (req, res, next) => {
  try {
    const { body, status } = req.body;

    if (!body || body.trim().length < 3)
      return next({ status: 422, message: "Answer body is required" });

    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return next({ status: 404, message: "Ticket not found" });

    const answer = await Ticket.create({
      parent: ticket._id,
      title: `Answer: ${ticket.title}`,
      body,
      user: req.user._id,
      departmentID: ticket.departmentID,
      course: ticket.course,
      isAnswer: 1,
    });

    ticket.isAnswer = 1;
    if (status) ticket.status = status;
    await ticket.save();

    res.status(201).json({
      message: "Answer sent successfully",
      ticket,
      answer,
    });
  } catch (err) {
    next(err);
  }
};

/*  Delete Ticket (Admin)*/
exports.remove = async (req, res, next) => {
  try {
    const deleted = await Ticket.findByIdAndDelete(req.params.id);
    if (!deleted) return next({ status: 404, message: "Ticket not found" });
    await Ticket.deleteMany({ parent: req.params.id });

    res.status(200).json({ message: "Ticket deleted successfully" });
  } catch (err) {
    next(err);
  }
};
