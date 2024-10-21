import React, { useState } from "react";
import { Form, Input } from "reactstrap";
import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
import styled from "styled-components";
require("dotenv").config();

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  margin: 130px 15px 0px 15px;
  align-items: center;
  justify-content: centre;
  color: #18a558;
`;
const Field = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  margin-bottom: 20px;
  box-shadow: 4px 4px 8px 0 rgba(0, 0, 0, 0.2);
`;
const Label = styled.div`
  font-size: 12px;
  font-weight: 400px;
  text-align: left;
`;
export const Title = styled.div`
  display: flex;
  font-size: 18px;
  font-family: "Urbanist", sans-serif;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  font-weight: bold;
`;
export const FormDisplay = styled.div`
  width: 40%;
  text-align: center;
  margin: 4px;
  display: flex;
  flex-direction: column;

  @media screen and (max-width: 600px) {
    width: 80%;
    margin: 20px;
  }
`;
const Image = styled.img`
  width: 100%;
  height: 100%;
`;

const ImageContainer = styled.div`
  width: 90vw;
  height: 100vh;
  margin-bottom: 10px;

  @media screen and (max-width: 600px) {
    height: 60vh;
  }
`;

const contactOptions = [
  { id: 1, type: "Enquiry" },
  { id: 2, type: "Complaint" },
  { id: 3, type: "Others" },
];

const ContactUs = ({ isAuthenticated }) => {
  document.title = "contact-us";

  const formDisplay = {
    width: "100%",
  };

  const [inputs, setInputs] = useState({});

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };
  const navigate = useNavigate();

  const HandleSubmit = (event) => {
    event.preventDefault();

    const email = localStorage.getItem("email");
    const subject = inputs.options;
    const ref = inputs.ref;
    const message = inputs.body;
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.getItem("access")}`,
        Accept: "application/json",
      },
    };
    const body = JSON.stringify({
      subject: subject,
      ref: ref,
      message: message,
      email: email,
    });
    if (isAuthenticated) {
      axios.post("/api/contact-us/", body, config);

      alert("we will get back to you soon");
      navigate("/");
    } else {
      navigate("/login");
    }
  };

  return (
    <Container>
      <ImageContainer>
        <Image src="/CustomerCare-1.jpg" alt="contact-us" />
      </ImageContainer>
      <Title>We love to hear from you </Title>
      <FormDisplay>
        <Form style={formDisplay} onSubmit={HandleSubmit}>
          <Label>Subject</Label>
          <Field>
            <Input
              name="options"
              type="select"
              value={inputs.options || ""}
              onChange={handleChange}
              required
            >
              <option value="">---subject---</option>
              {contactOptions.map((option) => (
                <option key={option.id} value={option.type}>
                  {option.type}
                </option>
              ))}
            </Input>
          </Field>

          <Label>Reference</Label>
          <Field>
            <Input
              placeholder="order ref.."
              name="ref"
              type="text"
              value={inputs.ref || ""}
              onChange={handleChange}
            />
          </Field>
          {isAuthenticated ? (
            ""
          ) : (
            <div>
              <Label>Email</Label>
              <Field>
                <Input
                  placeholder="abc@example.com"
                  name="email"
                  type="email"
                  value={inputs.email || ""}
                  onChange={handleChange}
                  required
                />
              </Field>
            </div>
          )}

          <Label>message</Label>
          <Field>
            <Input
              placeholder="enter message.."
              name="body"
              type="textarea"
              value={inputs.body || ""}
              onChange={handleChange}
              required
            />
          </Field>

          <button className="login-button" type="submit">
            Submit
          </button>
        </Form>
      </FormDisplay>
    </Container>
  );
};
const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, null)(ContactUs);
