
import React from 'react'
import { NavLink } from 'react-router-dom';
import { Link } from 'react-router-dom';

const AdminMenu = () => {
  return (
    <>
       <div className='text-center'>
       <div className="list-group">
            <Link to={'/dashboard/admin'} style={{ textDecoration: 'none' }}><h4 className="p-3 mb-2 bg-info text-dark">Admin Panel</h4></Link>
            {/* <NavLink to="/dashboard/admin" className="list-group-item list-group-item-action">
                Dashboard
            </NavLink> */}
            <NavLink to="/dashboard/admin/create-category" className="list-group-item list-group-item-action">
                Create Category
            </NavLink>
            <NavLink to="/dashboard/admin/create-product" className="list-group-item list-group-item-action">
                Create Product
            </NavLink>
            <NavLink to="/dashboard/admin/products" className="list-group-item list-group-item-action">
                Products
            </NavLink>
            <NavLink to="/dashboard/admin/orders" className="list-group-item list-group-item-action">
                Orders
            </NavLink>
            <NavLink to="/dashboard/admin/users" className="list-group-item list-group-item-action">
                Users
            </NavLink>
        </div>
    </div>

    </>
  )
}

export default AdminMenu