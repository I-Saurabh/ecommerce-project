import React from "react";
import Layout from "./../components/Layout/Layout";

const About = () => {
  return (
    <Layout title={"About us - Ecommerce app"}>
      <div className="row contactus ">
        <div className="col-md-6 ">
          <img
            src="/images/about.jpeg"
            alt="contactus"
            style={{ width: "100%" }}
          />
        </div>
        <div className="col-md-4">
          <p className="text-justify mt-2">
          Shift4Shop, <br/><br/>At Shift4Shop , all that you see is hand-picked and 100% true – 
          sourced straight from the best brands and their approved affiliates from US and over the world, 
          only for you.We present to you the most up to date – it’s in-season and on-incline; if it’s on 
          the racks, it’s on the web. Also, it’s nowest – have it conveyed ASAP to you, from a store close 
          you, when you utilize our Phygital services.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default About;