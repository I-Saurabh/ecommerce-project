import productModel from "../models/productModel.js";
import categoryModel from '../models/categoryModel.js';
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import fs from "fs";
import slugify from "slugify";
import braintree from "braintree";
import dotenv from 'dotenv';
import Razorpay from "razorpay";
import { Payment } from "../models/paymentModel.js"

dotenv.config();

//payment Gateway
var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

//Add Product
export const createProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;
    //Validation
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is Required" });
      case !description:
        return res.status(500).send({ error: "Description is Required" });
      case !price:
        return res.status(500).send({ error: "Price is Required" });
      case !category:
        return res.status(500).send({ error: "Category is Required" });
      case !quantity:
        return res.status(500).send({ error: "Quantity is Required" });
      case photo && photo.size > 1000000:
        return res
          .status(500)
          .send({ error: "photo is Required and should be less then 1mb" });
    }

    const products = new productModel({ ...req.fields, slug: slugify(name) });
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();
    const count = await productModel.countDocuments();
    res.status(201).send({
      success: true,
      message: "Product Created Successfully",
      products,
      numOfProducts:count,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in crearing product",
    });
  }
};

//get all products
export const getProductController = async (req, res) => {
  try {
    const products = await productModel
      .find({})
      .populate("category")
      .select("-photo")
      .limit(12)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      counTotal: products.length,
      message: "ALlProducts ",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Erorr in getting products",
      error: error.message,
    });
  }
};
// get single product
export const getSingleProductController = async (req, res) => {
  try {
    const product = await productModel
      .findOne({ slug: req.params.slug })
      .select("-photo")
      .populate("category");
    res.status(200).send({
      success: true,
      message: "Single Product Fetched",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Eror while getitng single product",
      error,
    });
  }
};

// get photo
export const productPhotoController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.pid).select("photo");
    if (product.photo.data) {
      res.set("Content-type", product.photo.contentType);
      return res.status(200).send(product.photo.data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Erorr while getting photo",
      error,
    });
  }
};

//delete controller
export const deleteProductController = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.params.pid).select("-photo");
    res.status(200).send({
      success: true,
      message: "Product Deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while deleting product",
      error,
    });
  }
};

//upate producta
export const updateProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;
    //alidation
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is Required" });
      case !description:
        return res.status(500).send({ error: "Description is Required" });
      case !price:
        return res.status(500).send({ error: "Price is Required" });
      case !category:
        return res.status(500).send({ error: "Category is Required" });
      case !quantity:
        return res.status(500).send({ error: "Quantity is Required" });
      case photo && photo.size > 1000000:
        return res
          .status(500)
          .send({ error: "photo is Required and should be less then 1mb" });
    }

    const products = await productModel.findByIdAndUpdate(
      req.params.pid,
      { ...req.fields, slug: slugify(name) },
      { new: true }
    );
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();
    res.status(201).send({
      success: true,
      message: "Product Updated Successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in Update product",
    });
  }
};

//filters 
export const productfiltersController = async (req,res) => {
  try{
    const{checked, radio} = req.body
    let args = {}
    if(checked.length >0) args.category = checked
    if(radio.length) args.price = {$gte:radio[0],$lte:radio[1]}
    const products = await productModel.find(args)
    res.status(200).send({
      success: true,
      products
    });
  }catch(error){
    console.log(error)
    res.status(400).send({
      success:false,
      message:'Error while Filering Products',
      error
    })
  }
};

//filters 
export const productCountController = async (req,res) => {
  try{
    const total = await productModel.find({}).estimatedDocumentCount()
    res.status(200).send({
      success: true,
      total
    });
  }catch(error){
    console.log(error)
    res.status(400).send({
      success:false,
      message:'Error in product count',
      error
    })
  }
};

//product list base on page
export const productListController = async (req,res) => {
  try{
    const 
    perPage =6;
    const page = req.params.page? req.params.page : 1;
    const products =await productModel
      .find({})
      .select('-photo')
      .skip((page - 1)* perPage)
      .limit(perPage)
      .sort({createdAt: -1});
    res.status(200).send({
      success: true,
      products
    });
  }catch(error){
    console.log(error)
    res.status(400).send({
      success:false,
      message:'Error in per page ctrl',
      error
    })
  }
};

//search product
export const searchProuctController = async (req,res) => {
  try{
    const {keyword} = req.params
    const results = await productModel.find({
      $or: [
        {name:{$regex :keyword, $options: 'i'}},
        {description:{$regex :keyword, $options: 'i'}}
      ]
    }).select('-photo')
    res.json(results)
  }catch(error){
    console.log(error)
    res.status(400).send({
      success:false,
      message:'Error in search product API',
      error
    })
  }
};

//similar products
export const realatedProductController = async (req,res) => {
  try{
    const {pid,cid} = req.params
    const products = await productModel
      .find({
        category: cid,
        _id: { $ne: pid },
      })
      .select("-photo")
      .limit(3)
      .populate("category");
    res.status(200).send({
      success: true,
      products,
    });
  }catch(error){
    console.log(error)
    res.status(400).send({
      success:false,
      message:'Error while getting related product',
      error
    })
  }
};

// getting product by category
export const productCategoryController = async (req,res) => {
  try{
    const category = await categoryModel.findOne({slug:req.params.slug})
    const products = await productModel.find({category}).populate('category')
    res.status(200).send({
      success: true,
      category,
      products,
    });
  }catch(error){
    console.log(error)
    res.status(400).send({
      success:false,
      message:'Error while getting product',
      error
    })
  }
};

//payment gateway controller
//token
export const braintreeTokenController = async(req,res) => {
  try {
    gateway.clientToken.generate({}, function(err,response){
      if(err){
        res.status(500).send(err)
      }else{
        res.send(response);
      }
    })
  } catch (error) {
    console.log(error)
  }
};

//payment
export const braintreePaymentController = async(req,res) => {
  try {
    const {cart, nonce} = req.body
    let total = 0;
    cart.map((i) => {
      total += i.price; 
    });
    let newTransaction = gateway.transaction.sale({
      amount: total,
      paymentMethodNonce: nonce,
      options:{
        submitForSettlement:true,
      }
    },
    function(error,result){
      if(result){
        const order = new orderModel({
          products: cart,
          payment: result,
          buyer: req.user._id,
        
        }).save()
        res.json({ok:true})
      }else{
        res.status(500).send(error)
      }
    }
    )
  } catch (error) {
    console.log(error)
  }
};

//Create New Review 
export const createProductReviewController = async (req, res, next) => {
  try{const { rating, name, comment, productId} = req.body;
  
  const review = {
    user: req.user._id,
    name,
    rating: Number(rating),
    comment
  }

  const product = await productModel.findById(productId);
  const isReviewed = product.reviews.find(
    r => r.user.toString() === req.user._id.toString()
  )
  if (isReviewed) {
    product.reviews.forEach(review => {
      if(review.user.toString() === req.user._id.toString()) {
        review.name = name
        review.comment = comment
        review.rating = rating
      }
    })

  }else{
    product.reviews.push(review) ;
    product.numOfReviews = product.reviews.length
  }
  product.ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length

  await product.save({ validateBeforeSave : false});
  res.status(200).json({
    success:true,
    product,
  })

  }catch(error){
    console.log(error),
    error
  }

}

// Get Product Reviews 
export const getProductReviewsController = async (req,res, next) => {
  try {
    const product = await productModel.findById(req.params.pid)

  res.status(200).json({
    success:true,
    reviews: product.reviews,
  })
  } catch (error) {
    console.log(error)
    res.status(400).send({
      success:false,
      error,
    })
  }
}

// Delete Product Reviews 
export const deleteProductReviewsController = async (req,res, next) => {
  
  try {
    const product = await productModel.findById(req.params.pid)

    const reviews = product.reviews.filter(r => r._id.toString() !== req.params.id.toString())
    const numOfReviews = reviews.length;
    let ratings = 0;
    if (numOfReviews > 0) {
      ratings = reviews.reduce((acc, item) => item.rating + acc, 0) / numOfReviews;
    }

    await productModel.findByIdAndUpdate(req.params.pid,{
      reviews,
      numOfReviews,
      ratings,
    }, {
      new: true,
      runValidators:true,
      
    })

  res.status(200).json({
    success:true,
  })
  } catch (error) {
    console.log(error)
    res.status(400).send({
      success:false,
      error,
    })
  }
}


// Razorpay payment Controllers

export const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET,
});

export const checkout = async (req,res) => {
  try{
    const options = {
      amount: Number(req.body.amount * 100) ,  // amount in the smallest currency unit
      currency: "INR",
    };
    const order = await instance.orders.create(options)
    res.status(200).send({
      success:true,
      order,
    })
  }catch(error){
    res.status(401).send({
      success:false,
      error,
    })
  }

  } 
//Payment Verification
  export const paymentVerification = async (req,res) => {
    try{
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature, cart, quantity } =
    req.body;

    const isAuthentic = true
    if(isAuthentic){
      const payment = new Payment({
        razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    }).save()


      const order = new orderModel({
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        products: cart,
        quantity ,
        payment: "Success",
        buyer: req.user._id,
      }).save()
      res.json({ok:true})

    }else{
      res.status(500).send({
        success: false,
        error
      })
    }

    
    }catch(error){
      res.status(401).send({
        success:false,
        error,
      })
    }
  
  } 
//failed payment handler
export const failedPayment = async (req,res) => {
  try{
    const {  cart } = req.body;
  const isAuthentic = false
  if(!isAuthentic){

    const order = new orderModel({
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      products: cart,
      payment: "Failed!",
      buyer: req.user._id,
    
    }).save()
    res.json({ok:true})

  }else{
    res.status(500).send({
      success: false,
      error
    })
  }

  
  }catch(error){
    res.status(401).send({
      success:false,
      error,
    })
  }

} 

export const userCountController = async (req,res) => {
  try{
    const total = await userModel.find({}).estimatedDocumentCount()
    res.status(200).send({
      success: true,
      total
    });
  }catch(error){
    console.log(error)
    res.status(400).send({
      success:false,
      message:'Error in user count',
      error
    })
  }
};

export const orderCountController = async (req,res) => {
  try{
    const total = await orderModel.find({}).estimatedDocumentCount()
    res.status(200).send({
      success: true,
      total
    });
  }catch(error){
    console.log(error)
    res.status(400).send({
      success:false,
      message:'Error in order count',
      error
    })
  }
};

export const calculateTotalPriceController = async (req, res) => {
  try {
    // Find all orders and populate the 'products' field to get product details
    const orders = await orderModel.find().populate('products');

    // Initialize the total price
    let totalPrice = 0;

    // Loop through each order
    for (const order of orders) {
      // Calculate the total price of products in the order
      let orderTotalPrice = 0;

      for (const product of order.products) {
        // Find the corresponding product in the Product collection
        const productInfo = await productModel.findById(product);

        if (productInfo) {
          orderTotalPrice += productInfo.price;
        }
      }

      // Add the order's total price to the overall total
      totalPrice += orderTotalPrice;
    }

    res.json({ totalPrice });
  } catch (error) {
    console.error('Error calculating total price:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

