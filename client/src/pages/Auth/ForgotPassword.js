import React, { useState } from "react";
import Layout from "../../components/Layout/Layout";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "../../styles/AuthStyles.css";
import validator from "validator";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [answer, setAnswer] = useState("");
    
    const navigate = useNavigate();

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
      if (password.length < 8){
          seterror("pass", "*Password should be atleast 8 characters long!");
          returnval = false;
      }
      if (validator.isStrongPassword(password, {
        minLength: 8, minLowercase: 1,
        minUppercase: 1, minNumbers: 1, minSymbols: 1
      })) {
        returnval = true;
      } else {
        if(validator.isStrongPassword(password, {
          minLength: 8, minLowercase: 0,
          minUppercase: 1, minNumbers: 1, minSymbols: 1
        })){
          seterror("pass", "*Password should have atleast 1 lowercase character!");
          returnval=false
        }
        if(validator.isStrongPassword(password, {
          minLength: 8, minLowercase: 1,
          minUppercase: 0, minNumbers: 1, minSymbols: 1
        })){
          seterror("pass", "*Password should have atleast 1 Uppercase character!");
          returnval=false
        }
        if(validator.isStrongPassword(password, {
          minLength: 8, minLowercase: 1,
          minUppercase: 1, minNumbers: 0, minSymbols: 1
        })){
          seterror("pass", "*Password should have atleast 1 Numeric character!");
          returnval=false
        }
        if(validator.isStrongPassword(password, {
          minLength: 8, minLowercase: 1,
          minUppercase: 1, minNumbers: 1, minSymbols: 0
        })){
          seterror("pass", "*Password should have atleast 1 Special character!");
          returnval=false
        }
      }
      var answer = document.forms['myForm']["fanswer"].value;
      if (answer.length < 6){
          seterror("answer", "*Answer is Required!");
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
      const res = await axios.post("/api/v1/auth/forgot-password", {
        email,
        newPassword,
        answer
      });
      if (res && res.data.success) {
        toast.success(res.data && res.data.message);
        
        navigate("/login");
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
    <Layout title="Forgot Password - Ecommerce App">
      <div className="form-container" style={{ minHeight: "90vh" }}>
        <form onSubmit={handleSubmit} name="myForm">
          <h4 className="title">RESET PASSWORD</h4>
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
          <div className="mb-3" id="answer">
            <input
              type="text"
              name="fanswer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="form-control"
              id="exampleInputEmail1"
              placeholder="Enter Your Favorite Sports "
             
            /><span className="formerror"> </span>
          </div>
          <div className="mb-3" id="pass">
            <input
              type="password"
              name="fpass"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="form-control"
              id="exampleInputPassword1"
              placeholder="Enter Your Password"
              
            /><span className="formerror"> </span>
          </div>
          <button type="submit" className="btn btn-primary">
            RESET
          </button>
        </form>
      </div>
    </Layout>
  )
}

export default ForgotPassword;