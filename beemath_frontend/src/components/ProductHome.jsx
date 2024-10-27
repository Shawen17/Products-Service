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
import VideoPlayer from "react-simple-video-player";
import Counter from "./Counter";
import { BASE_URL } from "./Url";
import { Variant } from "./Variant";
import { getVariants, productTotal } from "./utility/Utility";
import { addMultiToCart } from "../actions/auth";
import {
  ProductContainer,
  Details,
  Circle,
  ProductImg,
} from "./ProductDetailsModal";

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
      <div>
        <ProductContainer onClick={toggle}>
          <Circle>
            <ProductImg src={`${BASE_URL}${product.image}`} alt="product" />
          </Circle>

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
