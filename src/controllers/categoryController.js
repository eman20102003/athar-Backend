import Category from "../models/Category.js";

export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "اسم التصنيف مطلوب",
      });
    }

    const slug = name.trim().toLowerCase().replace(/\s+/g, "-");

    const existing = await Category.findOne({ slug });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "هذا التصنيف موجود بالفعل",
      });
    }

    const category = await Category.create({ name, slug });

    res.status(201).json({
      success: true,
      message: "تم إنشاء التصنيف بنجاح",
      category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });

    res.json({
      success: true,
      count: categories.length,
      categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { name } = req.body;

    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "التصنيف غير موجود",
      });
    }

    if (name) {
      category.name = name;
      category.slug = name.trim().toLowerCase().replace(/\s+/g, "-");
    }

    await category.save();

    res.json({
      success: true,
      message: "تم تحديث التصنيف",
      category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "التصنيف غير موجود",
      });
    }

    await category.deleteOne();

    res.json({
      success: true,
      message: "تم حذف التصنيف",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};