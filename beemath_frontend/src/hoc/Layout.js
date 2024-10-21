import React, { useEffect } from "react";
import NavBar from "../components/NavBar";
import { connect } from "react-redux";
import { checkIsAuthenticated, load_user } from "../actions/auth";
import Footer from "../components/Footer";

const Layout = (props) => {
  useEffect(() => {
    props.checkIsAuthenticated();
    props.load_user();
  });

  return (
    <div style={{ position: "relative", margin: "4px" }}>
      <NavBar />
      {props.children}
      <Footer />
    </div>
  );
};

export default connect(null, { checkIsAuthenticated, load_user })(Layout);
