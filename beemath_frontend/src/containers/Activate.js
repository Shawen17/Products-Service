import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { connect } from "react-redux";
import { verify } from "../actions/auth";

const Activate = ({ match, verify }) => {
  const [verified, setVerified] = useState(false);

  const params = useParams();
  const verify_account = (e) => {
    e.preventDefault();
    const uid = params.uid;
    const token = params.token;
    verify(uid, token);
    setVerified(true);
  };

  const navigate = useNavigate();
  if (verified) {
    return navigate("/login");
  }

  return (
    <div className="container" style={{ marginTop: "110px" }}>
      <div
        className="d-flex flex-column justify-content-center align-items-center"
        style={{ marginTop: "200px" }}
      >
        <hi>Verify your account</hi>
        <button
          className="btn btn-primary mt-3"
          onClick={verify_account}
          type="button"
        >
          Verify
        </button>
      </div>
    </div>
  );
};

export default connect(null, { verify })(Activate);
