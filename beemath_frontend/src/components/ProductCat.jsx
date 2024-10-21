import React from "react";
import styled from "styled-components";
import { BASE_URL } from "./Url";

const ImgContainer = styled.div`
  height: 140px;
  width: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 15px;

  &:hover {
    transform: scale(1.1);
    transition: all 0.5s ease;
  }

  @media screen and (max-width: 768px) {
    height: 80px;
    width: 80px;
    margin: 5px;
  }
`;

const ProductCat = (props) => {
  const product = props.product;

  return (
    <ImgContainer>
      <img
        key={product.id}
        className="m-auto align-self-center"
        width="100%"
        height="100%"
        src={`${BASE_URL}${product.image}`}
        alt="product"
      />
    </ImgContainer>
  );
};

export default ProductCat;
