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

const Circle = styled.div`
  display: flex;
  height: 220px;
  position: relative;
  flex-wrap: wrap;
`;
const ProductImg = styled.img`
  height: 200px;
  width: 150px;
  borderradius: 6px;
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
`;

const Price = styled.div`
  font-family: "Urbanist", sans-serif;
  color: black;
  font-weight: bold;
  font-size: 14px;
  margin-left: 2px;
`;
const Qty = styled.div`
  font-family: "Urbanist", sans-serif;
  color: black;
  font-weight: bold;
  font-size: 12px;
  margin-left: auto;
`;

const ProductContainer = styled.div`
  margin: 0px;
  justify-content: center;
  text-align: left;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  font-size: 20px;
  height: 270px;
  cursor: pointer;

  &:hover {
    transform: scale(1.1);
    transition: all 0.5s ease;
  }
  @media screen and (max-width: 768px) {
    height: 150px;
    margin: 1px;
    font-size: 10px;

    ${Circle} {
      height: 110px;
    }
    ${ProductImg} {
      height: 90px;
      width: 80px;
    }
    ${Price} {
      font-size: 10px;
    }
    ${Qty} {
      font-size: 8px;
    }
  }
`;
const Details = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ProductHome = (props) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("access");
  const email = localStorage.getItem("email");
  const [count, setCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [pickedProducts, setPickedProducts] = useState({});
  const [modal, setModal] = useState(false);

  const toggle = () => {
    setModal(!modal);
  };

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

  if (create) {
    const button = (
      <div className="container-fluid">
        <ProductContainer onClick={toggle}>
          <Circle>
            <ProductImg src={`${BASE_URL}${product.image}`} alt="product" />
          </Circle>
          <div className="row product-text-hm">
            <div className="col-12 pull-left ">
              <CardText>
                {props.descriptionDisplay(product.description)}
              </CardText>
            </div>
          </div>
          <Details>
            <Price>₦ {product.price}</Price>
            <Qty>{productQuantity} left</Qty>
          </Details>
        </ProductContainer>
      </div>
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
                      width={190}
                      height={190}
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
                  <CardSubtitle>{product.description}</CardSubtitle>
                  <CardText>{product.category}</CardText>
                  <p>{product.detail}</p>
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

export default connect(null, { addMultiToCart })(ProductHome);
