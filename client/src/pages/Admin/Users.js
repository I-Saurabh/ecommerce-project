import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "../../components/Layout/Layout";
import { useAuth } from "../../context/auth";
import moment from "moment";
import { Select } from "antd";
const { Option } = Select;

const Users = () => {
  const [users, setUsers] = useState([]);
  const [auth] = useAuth();

  const getUsers = async () => {
    try {
      const { data } = await axios.get("/api/v1/auth/all-users");
      setUsers(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (auth?.token) getUsers();
  }, [auth?.token]);


  return (
    <Layout title={"All Users Data"}>
      <div className="row dashboard">
        <div className="col-md-3">
          <AdminMenu />
        </div>
        <div className="col-md-9">
          <h1 className="text-center">All Users</h1>

                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Name</th>
                      <th scope="col">Phone</th>
                      <th scope="col">Address Line 1</th>
                      <th scope="col">Address Line 2</th>
                      <th scope="col">Address Line 3</th>
                      <th scope="col">City</th>
                      <th scope="col">State</th>
                      <th scope="col">Country</th>
                      <th scope="col">Pincode</th>
                    </tr>
                  </thead>
                {users?.map((user, i) => {
                return (
                  <tbody>
                    <tr>
                      <td>{i + 1}</td>
                      <td>
                        {user?.name}
                      </td>
                      <td>{user?.phone}</td>
                      <td>{user?.address1}</td>
                      <td>{user?.address2}</td>
                      <td>{user?.address3}</td>
                      <td>{user?.city}</td>
                      <td>{user?.state}</td>
                      <td>{user?.country}</td>
                      <td>{user?.pincode}</td>
                    </tr>
                  </tbody>
                   );
                })}
                </table>
              </div>
           
        </div>
      
    </Layout>
  )
}

export default Users