import stripe from "../config/stripe.js";
import Order from "../models/Order.js";
import Book from "../models/Book.js";
import User from "../models/User.js";


export const createPaymentIntent = async (req, res) => {
  try {
    const { bookId } = req.body;

    if (!bookId) {
      return res.status(400).json({
        success: false,
        message: "معرّف الكتاب مطلوب",
      });
    }

    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "الكتاب غير موجود",
      });
    }

    if (book.isFree || book.price === 0) {
      return res.status(400).json({
        success: false,
        message: "هذا الكتاب مجاني ولا يحتاج دفع",
      });
    }

    
    const alreadyOwned = req.user.purchasedBooks.some(
      (id) => id.toString() === bookId
    );

    if (alreadyOwned) {
      return res.status(400).json({
        success: false,
        message: "لديك هذا الكتاب بالفعل في مكتبتك",
      });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(book.price * 100), // Stripe بياخد Cents
      currency: "usd",
      metadata: {
        bookId: book._id.toString(),
        userId: req.user._id.toString(),
      },
    });

    const order = await Order.create({
      user: req.user._id,
      book: book._id,
      amount: book.price,
      stripePaymentIntentId: paymentIntent.id,
      status: "pending",
    });

    res.status(201).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      orderId: order._id,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error("Webhook signature verification failed:", error.message);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;

    try {
      const order = await Order.findOne({
        stripePaymentIntentId: paymentIntent.id,
      });

      if (order && order.status !== "paid") {
        order.status = "paid";
        await order.save();

        // إضافة الكتاب للمكتبة (unlock download + reader)
        await User.findByIdAndUpdate(order.user, {
          $addToSet: { purchasedBooks: order.book },
        });
      }
    } catch (error) {
      console.error("Webhook processing error:", error.message);
    }
  }

  if (event.type === "payment_intent.payment_failed") {
    const paymentIntent = event.data.object;

    await Order.findOneAndUpdate(
      { stripePaymentIntentId: paymentIntent.id },
      { status: "failed" }
    );
  }

  res.json({ received: true });
};


export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("book", "title coverImage price")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "book",
      "title coverImage"
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "الطلب غير موجود",
      });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "غير مصرح لك بمشاهدة هذا الطلب",
      });
    }

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};