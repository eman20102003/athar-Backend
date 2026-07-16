import Highlight from "../models/Highlight.js";

export const addHighlight = async (req, res) => {
  try {
    const { bookId, page, text, color, position } = req.body;

    const highlight = await Highlight.create({
      user: req.user._id,
      book: bookId,
      page,
      text,
      color,
      position,
    });

    res.status(201).json({
      success: true,
      message: "تم إضافة التظليل",
      highlight,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getHighlights = async (req, res) => {
  try {
    const { bookId } = req.params;

    const highlights = await Highlight.find({
      user: req.user._id,
      book: bookId,
    }).sort({ page: 1 });

    res.json({
      success: true,
      count: highlights.length,
      highlights,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteHighlight = async (req, res) => {
  try {
    const highlight = await Highlight.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!highlight) {
      return res.status(404).json({
        success: false,
        message: "التظليل غير موجود",
      });
    }

    await highlight.deleteOne();

    res.json({
      success: true,
      message: "تم حذف التظليل",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};