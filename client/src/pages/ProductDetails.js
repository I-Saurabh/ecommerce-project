import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/ProductDetailsStyles.css";
import { useCart } from "../context/cart";
import toast from "react-hot-toast";
import { useAuth } from "../context/auth";
import { Select } from "antd";
import { red } from "@material-ui/core/colors";
const { Option } = Select;

const ProductDetails = () => {
  const [auth] = useAuth();
  const params = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({});
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [cart, setCart] = useCart();
  const [rating, setRating] = useState()
  const [comment, setComment] = useState('')
  const [error,setError] = useState('')
  const name = auth?.user?.name;
  const userId = auth?.user?._id;

  //initalp details
  useEffect(() => {
    if (params?.slug) getProduct();
  }, [params?.slug]);
  //getProduct
  const getProduct = async () => {
    try {
      const { data } = await axios.get(
        `/api/v1/product/get-product/${params.slug}`
      );
      setProduct(data?.product);
      getAllReviews(data?.product._id);
      getSimilarProduct(data?.product._id, data?.product.category._id);
    } catch (error) {
      console.log(error);
    }
  };
  //get similar product
  const getSimilarProduct = async (pid, cid) => {
    try {
      const { data } = await axios.get(
        `/api/v1/product/related-product/${pid}/${cid}`
      );
      setRelatedProducts(data?.products);
      console.log(data)
      console.log(relatedProducts)
    } catch (error) {
      console.log(error);
    }
  };

  //get all reviews
  const getAllReviews = async (pid) => {
    try {
      const {data} = await axios.get(`/api/v1/product/reviews/${pid}`);
      setReviews(data?.reviews);
    } catch (error) {
      console.log(error);
    }
  };

  //Add review
  const addReviewHandler = async (e) => {
    try {
      e.preventDefault()
      setError(null);

      // Perform validation checks
      if (!rating && !comment.trim()) {
        setError('Please select a rating and write a review.');
        return;
      }

      if (!rating) {
        setError('Please select a rating.');
        return;
      }

      if (!comment.trim()) {
      setError('Please write a review.');
      return;
    }
      let review = {
        rating: rating,
        name: name,
        comment: comment,
        productId: product?._id,
    }

      await axios.put(`/api/v1/product/review/${product?._id}`, review)
    
      toast.success("Review Added Successfully");
      navigate(`/product/${params.slug}`);
      window.location.reload()
    } catch (error) {
      console.log(error)
      
    }

}

//delete Review
  const deleteProductReview = async(pid,id) => {
    try {
      const { data } = await axios.delete(`/api/v1/product/delete-review/${pid}/${id}`)
      if(data?.success){
        toast.success("Product Review Deleted Successfully")
        navigate(`/product/${params.slug}`);
        window.location.reload()
      }else{
        toast.error("Something Went Wrong!")
      }

    } catch (error) {
      console.log(error)
    }

  }

  return (
    <Layout>
      <div className="row container product-details">
        <div className="col-md-6">
          <img
            src={`/api/v1/product/product-photo/${product._id}`}
            className="card-img-top"
            alt={product.name}
            height="300"
            width={"350px"}
          />
        </div>
        <div className="col-md-6 product-details-info">
          <h1 className="text-center">Product Details</h1>
          <hr />
          <h6>Name : {product.name}</h6>
          <h6>Description : {product.description}</h6>
          <h6>
            Price : 
            {product?.price?.toLocaleString("hin-IN", {
              style: "currency",
              currency: "INR",
            })}
          </h6>
          <h6>Category : {product?.category?.name}</h6>
          <button
                  className="btn btn-dark ms-1"
                  onClick={() => {
                    setCart([...cart, product]);
                    localStorage.setItem(
                      "cart",
                      JSON.stringify([...cart, product])
                    );
                    toast.success("Item Added to cart");
                  }}
                >
                  ADD TO CART
          </button> 
        </div>
      </div>
      <hr/>
      <div className="row container similar-products">
        <h4>Similar Products ➡️</h4>
        {relatedProducts.length < 1 && (
          <p className="text-center">No Similar Products found</p>
        )}
        <div className="d-flex flex-wrap">
          {relatedProducts?.map((p) => (
            <div className="card m-2" key={p._id}>
              <img
                src={`/api/v1/product/product-photo/${p._id}`}
                className="card-img-top"
                alt={p.name}
              />
              <div className="card-body">
                <div className="card-name-price">
                  <h5 className="card-title">{p.name}</h5>
                  <h5 className="card-title card-price">
                    {p.price.toLocaleString("en-IN", {
                      style: "currency",
                      currency: "INR",
                    })} 
                  </h5>
                </div>
                <p className="card-text ">
                  {p.description.substring(0, 60)}...
                </p>
                <div className="card-name-price">
                  <button
                    className="btn btn-info ms-1"
                    onClick={() => navigate(`/product/${p.slug}`)}
                  >
                    More Details
                  </button>
                  
                </div>
              </div>
            </div>
          ))}
        </div>
        <hr />
      <div className="row container products-reviews">
        <h4>Reviews ➡️</h4>
        <p style={{fontStyle: 'italic'}}>Average Rating: {parseFloat(product?.ratings).toFixed(1)}⭐({product?.numOfReviews} Reviews)</p>
        <br/>
        <div className="d-flex flex-wrap">
        <div className="row p-3 w-50">
        {auth?.token ? (
          <>
                  <Select
                  type="Number"
                  mode="default"
                  bordered={false}
                  placeholder="Select Ratings"
                  size="small"
                  value={rating}
                  showSearch={false}
                  className="form-select mb-3"
                  onChange={(value) => {
                    setRating(value);
                  }}
                >
                  <Option value="1">1</Option>
                  <Option value="2">2</Option>
                  <Option value="3">3</Option>
                  <Option value="4">4</Option>
                  <Option value="5">5</Option>
                </Select>
                <textarea 
                    type="text" 
                    placeholder="Write a Review for this product..."
                    className="form-control-description " 
                    value={comment} 
                    onChange={(e) => setComment(e.target.value)}
                  />
                {error && <div className="error-message">{error}</div>}  
                  <button type="button" className="btn btn-primary" onClick={addReviewHandler}>Add Review</button>
          </>
                  ) : (
                    <button
                      className="btn btn-outline-warning"
                      onClick={() =>
                        navigate("/login", {
                          state: `/product/${params.slug}`,
                        })
                      }
                    >
                      Plase Login to Add Review
                    </button>
                  )}
        </div>
        <hr/>
        {reviews.length < 1 && (
          <div className="card m-2" style={{width: '40rem'}}>
          <div className="card-body">
            <h6 className="card-subtitle mb-2 text-muted"><b>No Review found for this product</b></h6>
          </div>
        </div>
        )}
        {reviews?.map(r => 
          r.user === userId ? (
          <div className="card border-info m-2" key={r._id} style={{width: '40rem'}}>
            <div class="row g-0">
            <div class="col-md-8">
            <div className="card-body">
              <h6 className="card-title"><b>{r?.name}</b></h6>
              <p>Rating: {r.rating}⭐</p>
              <p>{r.comment}</p>
            </div>
            </div>
          
            <div className=" col-md-2-mt-2 ">
              <button
                className="btn btn-danger btn-sm"
                onClick={() => deleteProductReview(product._id,r._id)}
              >
                Delete Review
              </button>
            </div>
            </div>
          </div>
        
          ):(
            <div className="card border-info m-2" key={r._id} style={{width: '40rem'}}>
            <div className="card-body">
              <h6 className="card-title "><b>{r?.name}</b></h6>
              <p>Rating: {r.rating}⭐</p>
              <p>{r.comment}</p>
            </div>
          </div>
          )
        )}
        </div>
      </div>
      </div>
    </Layout>
  );
};

export default ProductDetails;