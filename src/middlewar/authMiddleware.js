import jwt from "jsonwebtoken";
import User from "../models/User.js";




const protect = async (req, res, next) => {

  try {

    let token;


   

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {

      token = req.headers.authorization.split(" ")[1];

    }




    if (!token) {

      return res.status(401).json({
        success: false,
        message: "غير مصرح، يجب تسجيل الدخول",
      });

    }



   
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );


    

    const user = await User.findById(decoded.id)
      .select("-password");


    if (!user) {

      return res.status(401).json({
        success: false,
        message: "المستخدم غير موجود",
      });

    }



    req.user = user;


    next();


  } catch(error) {


    return res.status(401).json({
      success:false,
      message:"Token غير صالح",
    });


  }

};


export default protect;