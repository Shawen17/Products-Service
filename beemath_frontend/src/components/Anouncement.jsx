import React from "react";
import styled from "styled-components";

const Container = styled.div`
  height: 30px;
  background-color: #18a558;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 500;

  @media screen and (max-width: 600px) {
    height: 40px;
    font-size: 12px;
  }
`;

const Anouncement = () => {
  return (
    <Container>At Beemathworld you get the best household gadgets</Container>
  );
};

export default Anouncement;
