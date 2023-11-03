import React, { useState, useEffect } from "react";
import Layout from "./../../components/Layout/Layout";
import AdminMenu from "./../../components/Layout/AdminMenu";
import toast from "react-hot-toast";
import axios from "axios";
import { Select } from "antd";
import { useNavigate } from "react-router-dom";
const { Option } = Select;

const CreateProduct = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [shipping, setShipping] = useState("");
  const [photo, setPhoto] = useState("");

  //get all category
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/get-category");
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something wwent wrong in getting catgeory");
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  //create product function
  const handleCreate = async (e) => {
    e.preventDefault();
    validateForm()
    if(validateForm()){
    try {
      const productData = new FormData();
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("quantity", quantity);
      productData.append("photo", photo);
      productData.append("category", category);
      const { data } = axios.post(
        "/api/v1/product/create-product",
        productData
      );
      if (data?.success) {
        toast.error(data?.message);
      } else {
        toast.success("Product Created Successfully");
        navigate("/dashboard/admin/products");
        window.location.reload()
      }
    } catch (error) {
      console.log(error);
      toast.error("something went wrong");
    }
  }
};

  const clearErrors = () => {
    const errors = document.getElementsByClassName('formerror');
    for(let item of errors)
    {
        item.innerHTML = "";
    }


}
const seterror =(id, error) => {
    //sets error inside tag of id 
    const element = document.getElementById(id);
    element.getElementsByClassName('formerror')[0].innerHTML = error;

}

const validateForm = () => {
    var returnval = true;
    clearErrors();

    //perform validation and if validation fails, set the value of returnval to false
    const name = document.forms['myForm']["fname"].value;
    if (!isNaN(name)){
        seterror("name", "*Enter a valid product name");
        returnval = false;
    }

    if (name.length === 0){
        seterror("name", "*Product name is required!");
        returnval = false;
    }

    const description = document.forms['myForm']["fdescription"].value;
    if(description.length === 0){
      seterror("description","*Product Description is required")
      returnval = false;
    }

    const price = document.forms['myForm']["fprice"].value;
    if(price.length === 0){
      seterror("price","*Product price is required")
      returnval = false;
    }
    const quantity = document.forms['myForm']["fquantity"].value;
    if(quantity.length === 0){
      seterror("quantity","*Product quantity is required")
      returnval = false;
    }

    if(category.length === 0){
      seterror("category","*Product Category is required")
      returnval = false;
    }
    if(shipping.length === 0){
      seterror("shipping","*This is required")
      returnval = false;
    }
    
    if (photo) {
      // Check file size (in bytes)
      const fileSize = photo.size;
      const maxSize = 10 * 1024 * 1024; // 10MB

      if (fileSize > maxSize) {
        seterror("photo","*Photo size should less than 10 Mb")
        returnval = false;
      }
    }else{
      seterror("photo","*Product Image is required")
      returnval = false;
    }
    return returnval;
}

  return (
    <Layout title={"Dashboard - Create Product"}>
     <div className="row dashboard">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1 className="text-center">Create Product</h1>
            <form onSubmit={handleCreate} name="myForm" >
              <div className="mb-3" id="category">
              <Select
                bordered={false}
                placeholder="Select a category"
                size="large"
                showSearch
                className="form-select mb-3"
                onChange={(value) => {
                  setCategory(value);
                }}
              >
                {categories?.map((c) => (
                  <Option key={c._id} value={c._id}>
                    {c.name}
                  </Option>
                ))}
              </Select><span class="formerror"> </span>
              </div>
              <div className="mb-3" id = 'photo'>
                <label className="btn btn-outline-secondary col-md-12">
                  {photo ? photo.name : "Upload Photo"}
                  <input
                    type="file"
                    name="fphoto"
                    accept="image/*"
                    onChange={(e) => setPhoto(e.target.files[0])}
                    hidden
                  />
                </label><span className="formerror">*Image size should be less than 10Mb</span>
                <span class="formerror"></span>
              </div>
              <div className="mb-3">
                {photo && (
                  <div className="text-center">
                    <img
                      src={URL.createObjectURL(photo)}
                      alt="product_photo"
                      height={"200px"}
                      className="img img-responsive"
                    />
                  </div>
                )}
              </div>
              <div className="mb-3" id="name">
                <input
                  type="text"
                  name="fname"
                  value={name}
                  placeholder="write a name"
                  className="form-control"
                  onChange={(e) => setName(e.target.value)}
                /><span class="formerror"> </span>
              </div>
              <div className="mb-3" id="description">
                <textarea
                  type="text"
                  name="fdescription"
                  value={description}
                  placeholder="write a description"
                  className="form-control"
                  onChange={(e) => setDescription(e.target.value)}
                /><span class="formerror"></span>
              </div>

              <div className="mb-3" id="price">
                <input
                  type="number"
                  name="fprice"
                  value={price}
                  placeholder="write a Price"
                  className="form-control"
                  onChange={(e) => setPrice(e.target.value)}
                /><span class="formerror"> </span>
              </div>
              <div className="mb-3" id="quantity">
                <input
                  type="number"
                  name="fquantity"
                  value={quantity}
                  placeholder="write a quantity"
                  className="form-control"
                  onChange={(e) => setQuantity(e.target.value)}
                /><span class="formerror"></span>
              </div>
              <div className="mb-3" id='shipping'>
                <Select
                  bordered={false}
                  placeholder="Select Shipping "
                  size="large"
                  showSearch
                  className="form-select mb-3"
                  onChange={(value) => {
                    setShipping(value);
                  }}
                >
                  <Option value="0">No</Option>
                  <Option value="1">Yes</Option>
                </Select><span class="formerror"> </span>
              </div>
              <div className="mb-3">
                <button type="submit" className="btn btn-primary">
                  CREATE PRODUCT
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateProduct;