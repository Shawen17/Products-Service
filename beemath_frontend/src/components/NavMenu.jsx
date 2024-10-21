import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../actions/auth";

const NavMenu = (props) => {
  const guestLink = () => (
    <div>
      <ul>
        <li>
          <Link
            style={{ marginRight: "10px" }}
            className="active mb-1 nav-item"
            aria-current="page"
            to="/login"
          >
            Login/Signup
          </Link>
        </li>
        <li>
          <Link className="mb-1 nav-item" to="/products">
            Products
          </Link>
        </li>
      </ul>
    </div>
  );

  const authLink = () => (
    <div>
      <ul>
        <li>
          <Link
            style={{ marginRight: "10px" }}
            className="mb-1 nav-item"
            to="/dashboard"
          >
            Orders
          </Link>
        </li>
        <li>
          <Link
            style={{ marginRight: "10px" }}
            className="mb-1 nav-item"
            to="/products"
          >
            Products
          </Link>
        </li>
        <li>
          <Link className="mb-1 nav-item" to="/" onClick={props.onLogout}>
            Logout
          </Link>
        </li>
      </ul>
    </div>
  );
  return <div>{props.isAuthenticated ? authLink() : guestLink()}</div>;
};
const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { logout })(NavMenu);
