import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import userModel from "../models/userModel.js";
import JWT from "jsonwebtoken";
import orderModel from '../models/orderModel.js';
export const registerController = async (req, res) => {
    try {
        const {name,email,password,phone,address1,address2,address3,city,pincode,state,country,answer} = req.body;
        //validation
        if(!name){
            return res.send({message: "Name is required"});
        }
        if(!email){
            return res.send({message: "Email is required"});
        }
        if(!password){
            return res.send({message: "Password is required"});
        }
        if(!phone){
            return res.send({message: "Phone no is required"});
        }
        if(!answer){
            return res.send({message: "Answer is required"});
        }

        //check user
        const existingUser = await userModel.findOne({email});
        //existing user 
        if(existingUser){
            return res.status(200).send({
                success:false,
                message:"Already Registerd Please Login"}
            );
        }
        //register user
        const hashedPassword = await hashPassword(password);
        //save
        const user = await new userModel({
            name,
            email,
            phone,
            address1,
            address2,
            address3,
            city,
            pincode,
            state,
            country,
            password:hashedPassword,
            answer
        }).save();

        res.status(201).send({
            success:true,
            message:"User Registered Successfully",
            user
        });

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error in Registration',
            error
        });
    }
};

//POST LOGIN
export const loginController = async (req,res) => {
    try {
        const {email,password} = req.body;
        //validation
        if(!email || !password){
            return res.status(404).send({
                success:false,
                message:'Invalid Email or Password'
            });
        }
        //check user
        const user = await userModel.findOne({email});
        if(!user){
            return res.status(404).send({
                success:false,
                message:'Email is not registered'
            });
        }
        const match = await comparePassword(password,user.password);
        if(!match){
            return res.status(200).send({
                success:false,
                message:'Invalid Password'
            });
        }
        //token
        const token = await JWT.sign({_id:user._id},process.env.JWT_SECRET, {
            expiresIn:"7d",
        });
        res.status(200).send({
            success:true,
            message:"Login Successfully",
            user:{
                name:user.name,
                email:user.email,
                phone:user.phone,
                address1:user.address1,
                address2:user.address2,
                address3:user.address3,
                city:user.city,
                pincode:user.pincode,
                state:user.state,
                country:user.country,
                role: user.role,
                _id:user._id
            },
            token
        });
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error in login',
            error
        });
    }
};

// forgetPasswordController
export const forgotPasswordController = async (req, res) => {
    try {
      const { email, answer, newPassword } = req.body;
      if (!email) {
        res.status(400).send({ message: "Email is required" });
      }
      if (!answer) {
        res.status(400).send({ message: "answer is required" });
      }
      if (!newPassword) {
        res.status(400).send({ message: "New Password is required" });
      }
      //check
      const user = await userModel.findOne({ email, answer });
      //validation
      if (!user) {
        return res.status(404).send({
          success: false,
          message: "Wrong Email Or Answer",
        });
      }
      const hashed = await hashPassword(newPassword);
      await userModel.findByIdAndUpdate(user._id, { password: hashed });
      res.status(200).send({
        success: true,
        message: "Password Reset Successfully",
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Something went wrong",
        error,
      });
    }
  };

//test Controller
export const testController = (req,res) => {
    try {
        res.send("Protected Route");
    } catch (error) {
        console.log(error);
        res.send({error});
    }
};

//update profile 
export const updateProfileController = async (req,res) => {
    try {
        const {name,email,password,phone,address1,address2,address3,city,pincode,state,country} = req.body
        const user = await userModel.findById(req.user._id)
        //password
        if(password && password.length < 6){
            return res.json({error: 'Password is required and must be 6 character long'})
        }
        const hashedPassword = password? await hashPassword(password) : undefined
        const updatedUser = await userModel.findByIdAndUpdate(req.user._id,{
            name: name || user.name,
            password: hashedPassword || user.password,
            phone: phone || user.phone,
            address1: address1 || user.address1,
            address2: address2 || user.address2,
            address3: address3 || user.address3,
            city: city || user.city,
            pincode: pincode || user.pincode,
            state: state || user.state,
            country: country || user.country
        },{new:true})
        res.status(200).send({
            success:true,
            message: 'Profile Updated Successfully',
            updatedUser
        })
    } catch (error) {
        console.log(error)
        res.status(400).send({
            success: false,
            message: 'Error while updating profile',
            error
        })
    }
};

//orders
export const getOrdersController = async (req, res) => {
    try {
      const orders = await orderModel
        .find({ buyer: req.user._id })
        .populate("products", "-photo")
        .populate("buyer", "name");
      res.json(orders);
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error WHile Geting Orders",
        error,
      });
    }
  };

  
  //All orders
  export const getAllOrdersController = async (req, res) => {
    try {
      const orders = await orderModel
        .find({})
        .populate("products", "-photo")
        .populate("buyer", "name")
        .sort({ createdAt: "-1" });

      res.json(orders);
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error WHile Geting Orders",
        error,
      });
    }
  };

  //Users
  export const getAllUsersController = async (req, res) => {
    try {
      const users = await userModel
        .find({})
        

      res.json(users);
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error WHile Geting Users",
        error,
      });
    }
  };

//order status
export const orderStatusController = async (req, res) => {
    try {
      const { orderId } = req.params;
      const { status } = req.body;
       const orders = await orderModel.findByIdAndUpdate(
        orderId,
        { status },
        { new: true }
      );
      res.json(orders);
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error While Updateing Order",
        error,
      });
    }
  };
