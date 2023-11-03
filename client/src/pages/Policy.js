import React from "react";
import Layout from "./../components/Layout/Layout";

const Policy = () => {
  return (
    <Layout title={"Privacy Policy"}>
      <div className="row contactus ">
        <div className="col-md-6 ">
          <img
            src="/images/privacy.jpeg"
            alt="contactus"
            style={{ width: "100%" }}
          />
        </div>
        <div className="col-md-4">
          
          <p>Personal Information Provided by You. The personal information that we collect depends on the context of 
             your interactions with us and the Services, the choices you make, and the products and features you use. 
             The personal information we collect may include the following:<br/>➡️ names <br/>➡️ phone numbers <br/>➡️
             email addresses <br/>➡️ mailing addresses</p>
          <p>Sensitive Information. We do not process sensitive information.</p>
        </div>
      </div>
    </Layout>
  );
};

export default Policy;