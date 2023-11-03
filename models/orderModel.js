import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    paymentId: {
        type: String,
    },
    orderId: {
        type: String
    },
    products : [
        {
          type: mongoose.ObjectId,
          ref: 'Products'
        },
    ],
    payment: {
        type: String
    },
    buyer: {
        type:mongoose.ObjectId,
        ref: 'users'
    },
    status:{
        type:String,
      
      
        default:'Not Processed',
        enum: ["Not Processed", "Processing","Shipped", "Delivered", "Cancel"]
    },
    quantity:{
        type:Number
    }


}, {timestamps: true});

export default mongoose.model("Order", orderSchema);