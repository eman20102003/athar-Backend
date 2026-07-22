import openai from "../config/openai.js";
import Book from "../models/Book.js";
import ChatHistory from "../models/ChatHistory.js";

export const chatWithAI = async (req, res) => {
  try {
    const { question, bookId, currentPage } = req.body;

    if (!question || !bookId) {
      return res.status(400).json({
        success: false,
        message: "السؤال ورقم الكتاب مطلوبان",
      });
    }

    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "الكتاب غير موجود",
      });
    }

    const systemPrompt = `
أنت مساعد ذكاء اصطناعي داخل تطبيق قراءة كتب اسمه Athar.
تساعد القارئ في فهم كتاب بعنوان "${book.title}" للمؤلف ${book.author}.
${currentPage ? `القارئ حاليًا في الصفحة رقم ${currentPage}.` : ""}
أجب بشكل مختصر وواضح وباللغة العربية إلا إذا طلب المستخدم غير ذلك.
لا تختلق معلومات عن محتوى الكتاب لست متأكدًا منها، ووضح للقارئ إذا كان سؤاله يحتاج قراءة الصفحة الفعلية.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: question },
      ],
      temperature: 0.5,
    });

    const answer = completion.choices[0].message.content;

    const suggestions = [
      "لخص هذا الفصل",
      "اشرح هذه الفكرة بمثال",
      "اعطني أسئلة مراجعة",
    ];

    await ChatHistory.create({
      user: req.user._id,
      book: bookId,
      currentPage,
      question,
      answer,
    });

    res.json({
      success: true,
      answer,
      suggestions,
    });
  } catch (error) {
    console.error("AI chat error:", error); 
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getChatHistory = async (req, res) => {
  try {
    const { bookId } = req.params;

    const history = await ChatHistory.find({
      user: req.user._id,
      book: bookId,
    }).sort({ createdAt: 1 });

    res.json({
      success: true,
      count: history.length,
      history,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};