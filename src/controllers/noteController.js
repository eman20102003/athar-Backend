import Note from "../models/Note.js";

export const createNote = async (req, res) => {
  try {
    const { bookId, page, content } = req.body;

    const note = await Note.create({
      user: req.user._id,
      book: bookId,
      page,
      content,
    });

    res.status(201).json({
      success: true,
      message: "تم إضافة الملاحظة",
      note,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getNotes = async (req, res) => {
  try {
    const { bookId } = req.params;

    const notes = await Note.find({
      user: req.user._id,
      book: bookId,
    }).sort({ page: 1, createdAt: -1 });

    res.json({
      success: true,
      count: notes.length,
      notes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateNote = async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "الملاحظة غير موجودة",
      });
    }

    if (req.body.content !== undefined) {
      note.content = req.body.content;
    }

    await note.save();

    res.json({
      success: true,
      message: "تم تحديث الملاحظة",
      note,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "الملاحظة غير موجودة",
      });
    }

    await note.deleteOne();

    res.json({
      success: true,
      message: "تم حذف الملاحظة",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};