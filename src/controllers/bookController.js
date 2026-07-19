import Book from "../models/Book.js";

export const createBook = async (req, res) => {
  try {
    const {
      title,
      author,
      description,
      price,
      category,
      language,
      pages,
      isFree,
    } = req.body;

    if (!title || !author || !description || !category || !pages) {
      return res.status(400).json({
        success: false,
        message: "جميع الحقول المطلوبة يجب تعبئتها",
      });
    }

    if (!req.files || !req.files.cover || !req.files.pdf) {
      return res.status(400).json({
        success: false,
        message: "يجب رفع صورة الغلاف وملف الكتاب",
      });
    }

const coverImage = req.files.cover[0].path.replace(/\\/g, "/");
const pdfFile = req.files.pdf[0].path.replace(/\\/g, "/");

    const book = await Book.create({
      title,
      author,
      description,
      price: price || 0,
      category,
      language,
      pages,
      coverImage,
      pdfFile,
      isFree: isFree === "true" || isFree === true,
    });

    res.status(201).json({
      success: true,
      message: "تم إضافة الكتاب بنجاح",
      book,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getBooks = async (req, res) => {
  try {
    const { category, language, isFree, isFeatured, search, minPrice, maxPrice, sort, page = 1, limit = 12 } = req.query;

    const filter = { isPublished: true };

    if (category) filter.category = category;
    if (language) filter.language = language;
    if (isFree) filter.isFree = isFree === "true";
    if (isFeatured) filter.isFeatured = isFeatured === "true";

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } },
      ];
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const sortOptions = {
      newest: { createdAt: -1 },
      rating: { rating: -1 },
      reads: { readsCount: -1 },
    };
    const sortBy = sortOptions[sort] || sortOptions.newest;

    const skip = (Number(page) - 1) * Number(limit);

    const books = await Book.find(filter)
      .populate("category", "name")
      .sort(sortBy)
      .skip(skip)
      .limit(Number(limit));

    const total = await Book.countDocuments(filter);

    res.json({
      success: true,
      count: books.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      books,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
export const getBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate("category", "name");

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "الكتاب غير موجود",
      });
    }

    res.json({
      success: true,
      book,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "الكتاب غير موجود",
      });
    }

    const fields = ["title", "author", "description", "price", "category", "language", "pages", "isFree", "isPublished", "isFeatured"];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        book[field] = req.body[field];
      }
    });

    if (req.files?.cover) {
  book.coverImage = req.files.cover[0].path.replace(/\\/g, "/");
}
if (req.files?.pdf) {
  book.pdfFile = req.files.pdf[0].path.replace(/\\/g, "/");
}

    await book.save();

    res.json({
      success: true,
      message: "تم تحديث الكتاب",
      book,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "الكتاب غير موجود",
      });
    }

    await book.deleteOne();

    res.json({
      success: true,
      message: "تم حذف الكتاب",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};