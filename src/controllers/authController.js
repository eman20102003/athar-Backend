import bcrypt from "bcryptjs";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";


export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "جميع الحقول مطلوبة",
      });
    }

    
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "البريد الإلكتروني مستخدم بالفعل",
      });
    }

   
    const hashedPassword = await bcrypt.hash(password, 10);

   
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    
    const token = generateToken(user._id);

    
    res.status(201).json({
      success: true,
      message: "تم إنشاء الحساب بنجاح",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};


export const login = async (req, res) => {
  try {

    const { email, password } = req.body;

   
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "جميع الحقول مطلوبة",
      });
    }

    
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
      });
    }

    
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
      });
    }

    
    const token = generateToken(user._id);

   
    res.json({
      success: true,
      message: "تم تسجيل الدخول بنجاح",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};



export const getProfile = async (req,res)=>{

    try{

        res.json({
            success:true,
            user:req.user
        });


    }catch(error){

        res.status(500).json({
            success:false,
            message:error.message
        });

    }

};



export const updateProfile = async(req,res)=>{

    try{

        const {
            name,
            email
        } = req.body;



        const user = await User.findById(req.user._id);



        if(name){
            user.name=name;
        }


        if(email){
            user.email=email;
        }


        await user.save();



        res.json({

            success:true,

            message:"تم تحديث البيانات",

            user:{
                id:user._id,
                name:user.name,
                email:user.email,
                role:user.role
            }

        });



    }catch(error){


        res.status(500).json({
            success:false,
            message:error.message
        });


    }

};