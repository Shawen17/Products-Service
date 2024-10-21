import React from "react";
import styled from "styled-components";
import OutboxOutlinedIcon from "@mui/icons-material/OutboxOutlined";
import { motion } from "framer-motion";

const Container = styled.div`
  width: 100%;
  height: 100vh;
  flex-direction: column;
  background-color: #18a558;
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;
const AlertMessage = styled.div`
  display: flex;
  flex-direction: column;
  background-color: white;
  width: 35%;
  align-items: center;
  justify-content: center;

  @media screen and (max-width: 768px) {
    width: 80%;
  }
`;

const Brand = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 30px;
  margin-top: 100px;
`;

const SignupVerify = () => {
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
        <Brand>
          <img
            style={{ height: 60, borderRadius: 20, width: 60 }}
            src="/BeemathLogo.png"
            alt="beemath"
          />
          <h2 style={{ color: "white" }}>Beemathworld</h2>
        </Brand>

        <AlertMessage>
          <OutboxOutlinedIcon style={{ height: 60, width: 60 }} />
          <h5>Verify your Email Address</h5>
          <p className="mt-4">
            A verification link as been sent to you, kindly verify your account.
          </p>
        </AlertMessage>
      </Container>
    </motion.div>
  );
};

export default SignupVerify;
