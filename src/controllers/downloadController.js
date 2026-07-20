import path from "path";

/*export const downloadBook = async (req, res) => {
  try {
    
    const filePath = path.resolve(req.book.pdfFile);

    res.download(filePath, `${req.book.title}.pdf`, (err) => {
      if (err) {
        res.status(500).json({
          success: false,
          message: "حدث خطأ أثناء تحميل الملف",
        });
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const streamBookPdf = async (req, res) => {
  try {
    const filePath = path.resolve(req.book.pdfFile);
    res.sendFile(filePath);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};*/

export const downloadBook = async (req, res) => {
  try {
    res.redirect(req.book.pdfFile); // req.book جاية من checkOwnership middleware
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const streamBookPdf = async (req, res) => {
  try {
    res.redirect(req.book.pdfFile);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};