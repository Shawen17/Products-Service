import React, { useState } from "react";
import { Form, Input } from "reactstrap";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { connect } from "react-redux";
import states from "../components/State";
import { Container, Title, FormDisplay } from "./ContactUs";
import { Outline } from "./Login";
import { signup } from "../actions/auth";

const Signup = ({ signup, isAuthenticated }) => {
  const buttonStyle2 = {
    borderRadius: "6px",
    height: "30px",
    textAlign: "center",
    margin: "4px",
  };
  const formDisplay = {
    width: "100%",
  };
  document.title = "sign-up";
  const [accountCreated, setAccountCreated] = useState(false);
  const [inputs, setInputs] = useState({});

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value.trim() }));
  };
  const navigate = useNavigate();

  const HandleSubmit = async (event) => {
    event.preventDefault();
    const email = inputs.email;
    const first_name = inputs.first_name;
    const last_name = inputs.last_name;
    const state = inputs.state;
    const password = inputs.password;
    const re_password = inputs.re_password;
    if (password === re_password) {
      signup(email, first_name, last_name, state, password, re_password);
      setAccountCreated(true);
    } else {
      alert("password does not match");
    }
  };

  if (isAuthenticated) {
    navigate("/products");
  }
  if (accountCreated) {
    navigate("/signup/verify");
  }

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ rotate: 0, scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
      }}
    >
      <Container>
        <Title> Create an account </Title>
        <FormDisplay style={{ justifyContent: "center" }}>
          <Form style={formDisplay} onSubmit={HandleSubmit}>
            <Input
              className="mt-3 inputs"
              placeholder="firstname"
              name="first_name"
              type="text"
              value={inputs.first_name || ""}
              onChange={handleChange}
              required
            />
            <Input
              className="mt-3 inputs"
              placeholder="lastname"
              name="last_name"
              type="text"
              value={inputs.last_name || ""}
              onChange={handleChange}
              required
            />
            <Input
              className="mt-3 inputs"
              placeholder="abc@example.com"
              name="email"
              type="email"
              value={inputs.email || ""}
              onChange={handleChange}
              required
            />
            <Input
              className="mt-3 inputs"
              name="state"
              type="select"
              value={inputs.state || ""}
              onChange={handleChange}
              required
            >
              <option value="others">state of residence</option>
              {states.map((location) => (
                <option key={location.id} value={location.state}>
                  {location.state}
                </option>
              ))}
            </Input>

            <Input
              className="mt-3 inputs"
              placeholder="password"
              name="password"
              type="password"
              value={inputs.password || ""}
              onChange={handleChange}
              required
              minLength={8}
            />
            <Input
              className="mt-3 inputs"
              placeholder="confirm password"
              name="re_password"
              type="password"
              value={inputs.re_password || ""}
              onChange={handleChange}
              required
            />
            <div style={buttonStyle2}>
              <button className="login-button" type="submit">
                Signup
              </button>
            </div>
          </Form>
          <Outline>
            <p className="mt-3">
              Already have an account?
              <Link className="signup-link" to="/login">
                Login
              </Link>{" "}
            </p>
          </Outline>
        </FormDisplay>
      </Container>
    </motion.div>
  );
};
const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { signup })(Signup);
