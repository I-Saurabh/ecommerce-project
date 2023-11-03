import React from 'react';
import Layout from '../../components/Layout/Layout';
import UserMenu from '../../components/Layout/UserMenu';
import { useAuth } from '../../context/auth';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [auth] = useAuth();
  return (
    <Layout title={"Dashborad - Ecommerce App"}>
        <div className='container-fluid m-3 p-3'>
        <div className='row'>
            <div className='col-md-3'>
                <UserMenu/>
            </div>
            <div className='col-md-9 '>
            <div className='container-fluid m-3 p-3'>
                <div className='card w-75 p-3 ' style={{width:"18rem"}}>
                  <h3 className='text-center'>Personal Information</h3>
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item"><b>Name: </b>{auth?.user?.name}</li>
                    <li className="list-group-item"><b>Email: </b> {auth?.user?.email}</li>
                    <li className="list-group-item"><b>Phone: </b>{auth?.user?.phone}</li>
                    <li className="list-group-item"><b>Address: </b></li>
                    <li className="list-group-item">{auth?.user?.address1}</li>
                    <li className="list-group-item">{auth?.user?.address2}</li>
                    <li className="list-group-item">{auth?.user?.address3}</li>
                    <li className="list-group-item">{auth?.user?.city}, {auth?.user?.state}</li>
                    <li className="list-group-item">{auth?.user?.country}, {auth?.user?.pincode}</li>
                  </ul>
                  <button type="button" className="btn btn-outline-info" 
                  onClick={() => navigate("/dashboard/user/update-profile")}>
                    Edit info
                  </button>
                </div>
            </div>
            </div>
        </div>
        </div>
    </Layout>
  );
};

export default Dashboard;