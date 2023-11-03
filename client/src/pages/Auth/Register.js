import React, { useState,useEffect } from "react";
import Layout from "./../../components/Layout/Layout";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "../../styles/AuthStyles.css";
import validator from "validator";
import {Country, State, City} from 'country-state-city'


const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [address3, setAddress3] = useState("");
  // const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");

  const [answer, setAnswer] = useState("");
  const navigate = useNavigate();
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    // Load countries and set the default selected country
    const countryData = Country.getAllCountries();
    setCountries(countryData);
    setSelectedCountry(countryData[100]?.isoCode);
  }, []);

  useEffect(() => {
    // Load states based on the selected country
    if (selectedCountry) {
      const stateData = State.getStatesOfCountry(selectedCountry);
      setStates(stateData);
      setSelectedState('');
    }
  }, [selectedCountry]);

  useEffect(() => {
    // Load cities based on the selected state
    if (selectedState) {
      const cityData = City.getCitiesOfState(selectedCountry,selectedState);
      setCities(cityData);
      setSelectedCity('');
    }
  }, [selectedState]);

  const handleCountryChange = (e) => {
    setSelectedCountry(e.target.value);
  };

  const handleStateChange = (e) => {
    setSelectedState(e.target.value);
  };
  
  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
  };
  
  // form function
  const handleSubmit = async (e) => {
    e.preventDefault();
    validateForm()
    if(validateForm()){
    try {
      const country = countries.find((country) => country.isoCode === selectedCountry);
      const state = states.find((state) => state.isoCode === selectedState);
      // const state = getStateByIsoCode(selectedState);
      const res = await axios.post("/api/v1/auth/register", {
        name,
        email,
        password,
        phone,
        address1,
        address2,
        address3,
        city: selectedCity,
        pincode,
        state: state.name,
        country: country.name,
        answer,
      });
      if (res && res.data.success) {
        toast.success("User Registered Successfully");
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
        seterror("name", "*Enter a valid name");
        returnval = false;
    }

    if (name.length === 0){
        seterror("name", "*Length of name cannot be zero!");
        returnval = false;
    }
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
    
    var cpassword = document.forms['myForm']["fcpass"].value;
    if (cpassword !== password){
        seterror("cpass", "*Password Mismatched!");
        returnval = false;
    }
    var phone = document.forms['myForm']["fphone"].value;
    if (phone.length !== 10){
        seterror("phone", "*Phone Number is Required!");
        returnval = false;
    }else{
    var expr = /^(0|91)?[6-9][0-9]{9}$/;
    if (!expr.test(phone)) {
        seterror("phone", "*Enter Valid Indian Phone Number!");
        returnval = false;
        }
    if (isNaN(phone)){
      seterror("phone", "*Enter a valid Phone Number!");
      returnval = false;
    }
    }
    var address1 = document.forms['myForm']["faddress1"].value;
    if (address1.length === 0){
        seterror("address1", "*Required field!");
        returnval = false;
    }
    if (address2.length === 0){
        seterror("address2", "*Required field!");
        returnval = false;
    }
    
    if (selectedCity.length === 0){
        seterror("city", "*Required field!");
        returnval = false;
    }

    if (selectedState.length === 0){
      seterror("state", "*Required field!");
      returnval = false;
   }
   if (selectedCountry.length === 0){
    seterror("country", "*Required field!");
    returnval = false;
 }
    
    var pincode = document.forms['myForm']["fpincode"].value;
    if (pincode.length !== 6){
        seterror("pincode", "*Enter a valid 6 digit pincode!");
        returnval = false;
    }
    var answer = document.forms['myForm']["fanswer"].value;
    if (answer.length === 0){
        seterror("answer", "*Answer is required!");
        returnval = false;
    }
    
    return returnval;
}
const handleNameKeyPress = (e) => {
  // Get the key code of the pressed key
  const keyCode = e.charCode;

  // Check if the pressed key is a number (0-9)
  if (keyCode >= 48 && keyCode <= 57) {
    e.preventDefault(); // Prevent the input of numbers
  }
};

const handleKeyPress = (e) => {
  // Get the key code of the pressed key
  const keyCode = e.charCode;

  // Check if the pressed key is a number (0-9)
  if (keyCode < 48 || keyCode > 57) {
    e.preventDefault(); // Prevent the input of non-numeric characters
  }
};


  return (
    <Layout title="Register - Ecommer App">
      <div className="form-container g-2" style={{ minHeight: "90vh" }}>
        <form onSubmit={handleSubmit} name="myForm" >
          <h4 className="title">REGISTER FORM</h4>
          <div className="mb-3" id="name">
            <input
              type="text"
              name="fname"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyPress={handleNameKeyPress}
              className="form-control"
              id="exampleInputEmail1"
              placeholder="Enter Your Name"
              autoFocus
            /><span class="formerror"> </span>
          </div>
          <div className="mb-3" id="email">
            <input
              type="email"
              name="femail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              id="exampleInputEmail1"
              placeholder="Enter Your Email "
              
            /><span class="formerror"></span>
            
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
            /><span class="formerror"> </span>
          </div>
          <div className="mb-3" id="cpass">
            <input
              type="password"
              name="fcpass"
              className="form-control"
              id="exampleInputPassword1"
              placeholder="Confirm Password"            
            /><span class="formerror"> </span>
          </div>
          <div className="mb-3" id="phone">
            <input
              type="phone"
              name="fphone"
              value={phone}
              maxLength={10}
              onChange={(e) => setPhone(e.target.value)}
              onKeyPress={handleKeyPress}
              className="form-control"
              id="exampleInputEmail1"
              placeholder="Enter Your Phone"             
            /><span class="formerror"> </span>
          </div>
          
          {/* <div className="col-sm mb-3" id="city">
            <input
              type="text"
              name="fcity"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="form-control"
              id="exampleInputEmail1"
              placeholder="City"             
            /><span class="formerror"> </span>
          </div> */}
          <div className="col-sm mb-3" id="Country">
          <select
            style={{width: 250, height: 30}}
            bordered={false}
            placeholder="Select a category"
            size="large"
            name="fcountry"
            value={selectedCountry}
            onChange={handleCountryChange}
          >
          {countries.map((country) => (
              <option key={country.isoCode} value={country.isoCode}>
                {country.name}
              </option>
            ))}
          </select>
          </div>

          <div className="col-sm mb-3" id="state">
          <select
            style={{width: 250,height: 30}}
            name="fstate"
            value={selectedState}
            onChange={handleStateChange}
          >
            <option value="">Select State</option>
            {states.map((state) => (
              <option key={state.isoCode} value={state.isoCode}>
                {state.name}
              </option>
            ))}
          </select>
          <br/><span class="formerror"> </span>
          </div>
          
          <div className="col-sm mb-3" id="city">
          <select
            style={{width: 250,height: 30}}
            name="fcity"
            value={selectedCity}
            onChange={handleCityChange}
          >
            <option value="">Select City</option>
            {cities.map((city) => (
              <option key={city.isoCode} value={city.isoCode}>
                {city.name}
              </option>
            ))}
          </select>
          <br/><span class="formerror"> </span>
          </div>

          <div className="mb-3" id="address1">
            <input
              type="text"
              name="faddress1"
              value={address1}
              onChange={(e) => setAddress1(e.target.value)}
              className="form-control"
              id="exampleInputEmail1"
              placeholder="House No., Building Name"             
            /><span class="formerror"> </span>
          </div>
          <div className="mb-3" id="address2">
            <input
              type="text"
              name="faddress2"
              value={address2}
              onChange={(e) => setAddress2(e.target.value)}
              className="form-control"
              id="exampleInputEmail1"
              placeholder="Road Name, Area, Colony"             
            /><span class="formerror"> </span>
          </div>
          <div className="mb-3" id="address3">
            <input
              type="text"
              name="faddress3"
              value={address3}
              onChange={(e) => setAddress3(e.target.value)}
              className="form-control"
              id="exampleInputEmail1"
              placeholder="Landmark(Optional)"             
            />
          </div>

          <div className="col-sm mb-3" id="pincode">
            <input
              type="pincode"
              name="fpincode"
              value={pincode}
              maxLength={6}
              onChange={(e) => setPincode(e.target.value)}
              onKeyPress={handleKeyPress}
              className="form-control"
              id="exampleInputEmail1"
              placeholder="Pincode"             
            /><span class="formerror"> </span>
          </div>
          <div className="mb-3" id="answer">
            <input
              type="text"
              name="fanswer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="form-control"
              id="exampleInputEmail1"
              placeholder="What is Your Favorite sports"
            /><span class="formerror"> </span>
          </div>
          <button type="submit" className="btn btn-primary">
            REGISTER
          </button>
          <div className="mb-3">
          <p>
          <div className="link-primary"
          
           >
            Already have an account?{' '}
            <a href="/login" style={{ cursor: 'pointer' }}>Login</a>
          </div>
          </p>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default Register;