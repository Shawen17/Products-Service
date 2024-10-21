import React, { useState } from "react";
import {
  Container,
  Card,
  CardImg,
  CardBody,
  CardSubtitle,
  Button,
  CardText,
} from "reactstrap";
import Counter from "../components/Counter";
import { BASE_URL } from "./Url";

const GiveDetails = (props) => {
  const [count, setCount] = useState(0);
  const product = props.product;

  const increment = (num) => {
    setCount(num + 1);
  };

  const decrement = (num) => {
    setCount(num - 1);
  };

  const imgStyle = {
    height: 190,
    width: 190,
    paddingTop: 4,
    borderRadius: 6,
    justifyContent: "left",
  };

  const cardStyle = {
    margin: "8px",
    justifyContent: "left",
    textAlign: "center",
  };

  const addToCart = () => {
    console.log(product);
  };

  return (
    <Container>
      <Card style={cardStyle}>
        <CardImg
          key={product.id}
          className="m-auto align-self-center"
          style={imgStyle}
          src={`${BASE_URL}${product.image}`}
          alt="product image"
        />
        <CardBody>
          <CardSubtitle>{product.description}</CardSubtitle>
          <CardText>{product.category}</CardText>
          <p>{product.detail}</p>
          <Counter decrement={decrement} increment={increment} count={count} />
          <Button
            style={{ color: "white", backgroundColor: "teal" }}
            onClick={addToCart}
          >
            Add to cart
          </Button>
        </CardBody>
      </Card>
    </Container>
  );
};

export default GiveDetails;
