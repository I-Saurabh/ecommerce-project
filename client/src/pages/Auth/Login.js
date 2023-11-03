import React, { useState } from "react";
import Layout from "./../../components/Layout/Layout";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import "../../styles/AuthStyles.css";
import { useAuth } from "../../context/auth";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [auth,setAuth] = useAuth();
    
    const navigate = useNavigate();
    const location = useLocation();

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
     
      var email = document.forms['myForm']["femail"].value;
      if (email.length===0){
          seterror("email", "*Email is required!");
          returnval = false;
      }
      var password = document.forms['myForm']["fpass"].value;
      if (password.length === 0){
        seterror("pass", "*Please Enter the Password!");
        returnval = false;
    }
      if (password.length < 6){
          seterror("pass", "*Password should be atleast 8 characters long!");
          returnval = false;
      }
      
      return returnval;
}
    // form function
  const handleSubmit = async (e) => {
    e.preventDefault();
    validateForm()
    if(validateForm()){
    try {
      const res = await axios.post("/api/v1/auth/login", {
        email,
        password,
        
      });
      if (res && res.data.success) {
        toast.success('Login Successful');
        setAuth({
          ...auth,
          user: res.data.user,
          token: res.data.token,
        })
        localStorage.setItem('auth',JSON.stringify(res.data));
        navigate(location.state || "/");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  }

  };
  return (
    <Layout title="Login - Ecommerce App">
      <div className="form-container" style={{ minHeight: "90vh" }}>
        <form onSubmit={handleSubmit} name="myForm">
          <h4 className="title">LOGIN</h4>
          <div className="mb-3" id="email">
            <input
              type="email"
              name="femail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              id="exampleInputEmail1"
              placeholder="Enter Your Email "
              
            /><span className="formerror"> </span>
          </div>
          <div className="mb-3" id="pass">
            <input
              type="password"
              name="fpass"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              id="exampleInputPassword1"
              placeholder="Enter Your Password"
            /><span className="formerror"> </span>
          </div>
          <div className="mb-3">
          <p><div  className="link-primary" onClick={() => {navigate('/forgot-password')}}>Forgot Password </div></p>

          </div>
          <button type="submit" className="btn btn-primary">
            LOGIN
          </button>
          <div className="mb-3">
          <p><div  className="link-primary" onClick={() => {navigate('/register')} } style={{ cursor: 'pointer' }}>New User? Register </div></p>
          </div>
        </form>
      </div>
    </Layout>
  )
}

export default Login