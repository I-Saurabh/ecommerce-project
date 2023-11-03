import React from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "./../../components/Layout/Layout";
import { useAuth } from "../../context/auth";
import Dashboard from "../../components/Layout/Dashboard"

const AdminDashboard = () => {
  const [auth] = useAuth();
  return (
    <Layout>
      <div className="row dashboard">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <div className="card w-75 p-3">
              <Dashboard/>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;