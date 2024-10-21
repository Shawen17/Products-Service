import React, { Fragment, useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  Container,
  Card,
  CardBody,
  CardSubtitle,
  CardText,
} from "reactstrap";
import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import styled from "styled-components";
import VideoPlayer from "react-simple-video-player";
import Counter from "./Counter";
import { BASE_URL } from "./Url";
import { Variant } from "./Variant";
import { getVariants, productTotal } from "./utility/Utility";
import { addMultiToCart } from "../actions/auth";

export const Circle = styled.div`
  background-color: rgba(128, 128, 128, 0.2);
  height: 70%;
  width: 100%;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ProductImg = styled.img`
  padding: 8px;
  width: 80%;
  height: 80%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ProductContainer = styled.div`
  height: 300px;
  width: 180px;
  padding: 7px;
  position: relative;
  border-radius: 6px;
  cursor: pointer;
  margin: 15px;
  background-color: whitesmoke;

  &:hover {
    transform: scale(1.1);
    transition: 1s ease-in-out;
  }
`;
const Details = styled.div`
  padding: 3px;
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
`;

const ProductDetails = styled.p`
  color: #18a558;
`;

const Circ = styled.div`
  position: absolute;
  border-radius: 50%;
  border: 0.5px solid grey;
`;

const SmallCircle = styled(Circ)`
  width: 20px;
  height: 20px;
  z-index: 99;
  top: ${(prop) => prop.testPosition?.top};
  left: ${(prop) => prop.testPosition?.left};
  display: ${(prop) => prop.testPosition?.display};
`;

const ProductDetailsModal = (props) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("access");
  const email = localStorage.getItem("email");
  const [count, setCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [pickedProducts, setPickedProducts] = useState({});
  const [modal, setModal] = useState(false);
  const [testPosition, setTestPosition] = useState({
    top: 0,
    left: 0,
    display: "none",
  });

  const handleGrow = (event) => {
    const boundingRect = event.currentTarget.getBoundingClientRect();

    const x = event.clientX - boundingRect.left;
    const y = event.clientY - boundingRect.top;

    const i =
      Math.floor(x / (boundingRect.width / 10)) +
      Math.floor(y / (boundingRect.height / 10)) * 10;

    const xPosition = i % 10;
    const yPosition = Math.floor(i / 10);

    setTestPosition({
      top: yPosition * 10 + "vh",
      left: xPosition * 10 + "vw",
      display: "block",
    });

    setTimeout(() => setTestPosition({ display: "none" }), 1100);
  };

  const toggle = () => {
    setModal(!modal);
  };

  const HandleClick = (event) => {
    // Directly call handleGrow here instead of adding event listener
    handleGrow(event);

    // You can also control modal toggle behavior here
    setTimeout(() => setModal(!modal), 1200);
  };
  console.log(testPosition);

  const create = props.create;
  const product = props.product;
  const allProducts = props.allProducts;

  const multiIncrement = (num, item) => {
    setCount(num + 1);
    if (num + 1 > 0) {
      const product = { ...item, quantity: num + 1 };
      setPickedProducts(product);
      updateCart(product);
    }
  };

  const multiDecrement = (num, item) => {
    setCount(num - 1);
    if (num > 0) {
      const product = { ...item, quantity: num - 1 };
      setPickedProducts(product);
      updateCart(product);
    }
  };

  const updateCart = (cart) => {
    if (cartItems.length > 0) {
      const index = cartItems.findIndex((ele) => {
        if (ele.id === cart.id) {
          return true;
        }
        return false;
      });
      if (index !== -1) {
        const items = [...cartItems];
        items[index] = cart;
        setCartItems(items);
      } else {
        const items = [...cartItems];
        items.push(cart);
        setCartItems(items);
      }
    } else {
      cartItems.push(cart);
      setCartItems(cartItems);
    }
  };

  const addMultiProduct = async (products, toggle) => {
    const finalProduct = products.filter((product) => {
      return product.quantity !== 0;
    });
    if (token != null) {
      if (finalProduct.length > 0) {
        await props.addMultiToCart(email, finalProduct);
        alert(
          `${finalProduct.length} ${finalProduct[0].description}(s) added to cart`
        );
        setCount(0);
        setCartItems([]);
        setPickedProducts({});
        toggle();
      }
    } else {
      navigate("/login");
    }
  };

  const productQuantity = productTotal(allProducts, product.description);

  const cardStyle = {
    margin: "8px",
    justifyContent: "left",
    textAlign: "center",
  };

  const subtitle = {
    fontSize: 18,
    fontWeight: "bold",
  };

  if (create) {
    var button = (
      <ProductContainer onClick={HandleClick}>
        <Circle>
          <ProductImg src={`${BASE_URL}${product.image}`} alt="product" />
        </Circle>
        <SmallCircle testPosition={testPosition} className="grow" />

        <div className="desc">
          <p>{product.category}</p>
          <div>{props.descriptionDisplay(product.description)}</div>
          <Details>
            <div style={{ color: "green", fontSize: 15 }}>
              ₦{product.price.toLocaleString()}
            </div>
            <div>{productQuantity} left</div>
          </Details>
        </div>
      </ProductContainer>
    );

    return (
      <Fragment>
        {button}
        <Modal isOpen={modal} toggle={toggle}>
          <ModalHeader toggle={toggle}>Product Details</ModalHeader>

          <ModalBody>
            <Container>
              <Card style={cardStyle}>
                {product.video ? (
                  <div className="m-auto align-self-center">
                    <h6>how it works</h6>
                    <VideoPlayer
                      url={`${BASE_URL}${product.video}`}
                      poster={`${BASE_URL}${product.image}`}
                      width={210}
                      height={210}
                      autoplay={false}
                    />
                  </div>
                ) : (
                  <img
                    key={product.id}
                    className="m-auto align-self-center imgStyle"
                    src={`${BASE_URL}${product.image}`}
                    alt="product"
                  />
                )}

                <CardBody>
                  <CardSubtitle style={subtitle}>
                    {product.description}
                  </CardSubtitle>
                  <CardText>{product.category}</CardText>
                  <ProductDetails>{product.detail}</ProductDetails>
                  {product.variant ? (
                    <div>
                      <h3>Variants</h3>
                      {getVariants(allProducts, product.description).map(
                        (item, index) => (
                          <div key={index}>
                            <Variant
                              key={index}
                              cartItems={cartItems}
                              pickedProducts={pickedProducts}
                              multiIncrement={multiIncrement}
                              multiDecrement={multiDecrement}
                              count={count}
                              item={item}
                              quantity={item.quantity}
                            />
                          </div>
                        )
                      )}
                      <button
                        className="add-cart"
                        onClick={() => {
                          addMultiProduct(cartItems, toggle);
                        }}
                      >
                        Add to cart
                      </button>
                    </div>
                  ) : (
                    <div>
                      <Counter
                        decrement={props.decrement}
                        increment={props.increment}
                        count={props.count}
                        quantity={product.quantity}
                      />
                      <button
                        className="add-cart"
                        onClick={() => {
                          props.HandleButtonClick(product, toggle);
                        }}
                      >
                        Add to cart
                      </button>
                    </div>
                  )}
                </CardBody>
              </Card>
            </Container>
          </ModalBody>
        </Modal>
      </Fragment>
    );
  }
};

export default connect(null, { addMultiToCart })(ProductDetailsModal);
