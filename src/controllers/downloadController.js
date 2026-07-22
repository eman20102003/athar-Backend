import path from "path";



export const downloadBook = async (req, res) => {
  try {
    res.redirect(req.book.pdfFile); 
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