import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Row, Col } from "reactstrap";
import styled from "styled-components";
import { connect } from "react-redux";
import ProductDetailsModal from "../components/ProductDetailsModal";
import Pagination from "../components/Pagination";
import { descriptionDisplay } from "./Products";
import { logout, addToCart } from "../actions/auth";
import OrderItems from "../components/Order/OrderItems";
import { unique } from "../components/utility/Utility";
require("dotenv").config();

const Items = styled.div`
  width: 100%;
  margin-top: 20px;
`;

const SubTitle = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  font-size: 15px;
  font-weight: bold;
`;

const Desc = styled.div`
  display: flex;
  margin-left: auto;
  color: #18a558;
  font-size: 15px;
`;

const TH = styled.th`
  font-size: 17px;
`;
const TD = styled.td`
  font-size: 15px;
`;

const Status = styled.div`
  font-size: 15px;
  font-weight: bold;
`;

const Container = styled.div`
  margin: 130px 10px 10px 0px;
  width: vw;
  display: flex;
  align-items: center;
  justify-content: center;

  @media screen and (max-width: 768px) {
    ${TH} {
      font-size: 13px;
    }
    ${TD} {
      font-size: 10px;
    }
    ${Status} {
      font-size: 10px;
    }
  }
`;

let PageSize = 10;

const DashBoard = (props) => {
  document.title = "orders";
  const [currentPage, setCurrentPage] = useState(1);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const token = localStorage.getItem("access");
  const email = localStorage.getItem("email");
  const [count, setCount] = useState(0);
  const navigate = useNavigate();

  //use useMemo inplace of useEffect
  useEffect(() => {
    const fetchData = async () => {
      const order_api = `http://localhost:8082/api/orders/user?email=${email}`;
      const product_api = "http://localhost:8083/api/orders/";

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${token}`,
          Accept: "application/json",
        },
      };
      try {
        const response1 = await axios.get(order_api, config);
        setOrders(response1.data.data.orders);
        const product_data = response1.data.data.products;
        const body = { products: product_data };
        const response2 = await axios.put(product_api, body, config);
        setProducts(response2.data.products);
      } catch (err) {
        if (err.response?.status === 401) {
          props.logout();
          navigate("/login");
        } else {
          console.error("An error occurred:", err.message);
        }
      }
    };
    fetchData();
  }, [email, token, props, navigate]);

  const recentOrders = [...products];
  const uniqueRecentOrders = unique(recentOrders);

  const increment = (num) => {
    setCount(num + 1);
  };

  const decrement = (num) => {
    if (num > 0) {
      setCount(num - 1);
    }
  };

  const currentData = useMemo(() => {
    const allOrders = orders;
    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    return allOrders.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, orders]);

  const orderPresent = orders.length > 0;

  const HandleButtonClick = async (product, toggle) => {
    if (token != null) {
      if (count > 0) {
        props.addToCart(email, product, count);
        alert(`${count} ${product.description} added to cart`);
        setCount(0);
        toggle();
      }
    } else {
      navigate("/login");
    }
  };

  const noPreviousOrders = () => (
    <div
      className="container mt-3 justify-content-center"
      style={{ height: 420, borderRadius: 6, border: "1px" }}
    >
      <img
        className="center mt-4"
        style={{ height: 120, borderRadius: 20, width: 120 }}
        src="/beemathLogo.png"
        alt="order"
      />
      <h2 className="order-header">You are yet to make any order</h2>
      <p className="mt-3" style={{ textAlign: "center" }}>
        {" "}
        Start making orders so we can also suggest other products you might like
      </p>
      <button className="start-shopping-button center">
        <Link style={{ textDecoration: "none", color: "white" }} to="/products">
          START SHOPPING
        </Link>
      </button>
    </div>
  );

  const hasPreviousOrders = () => (
    <div style={{ width: "100%", margin: "15px" }}>
      {currentData.length > 0 &&
        currentData.map((item) => {
          return <OrderItems item={item} />;
        })}
      <Pagination
        key={currentPage}
        className="pagination"
        currentPage={currentPage}
        totalCount={orders.length}
        pageSize={PageSize}
        onPageChange={(page) => setCurrentPage(page)}
      />

      <button className="start-shopping-button center">
        <Link className="nav-link" to="/products">
          START SHOPPING
        </Link>
      </button>
      <Items>
        <SubTitle>
          <h6>Similar items you might like</h6>
          <Desc>
            <Link className="nav-link" to="/products">
              SEE ALL
            </Link>
          </Desc>
        </SubTitle>
        <Row>
          {!products || products.length <= 0 ? (
            <div width="50%" height="80%" className="text-center">
              <h4>start making orders</h4>
            </div>
          ) : (
            uniqueRecentOrders.slice(0, 6).map((product) => (
              <Col xs="6" sm="4" md="3" lg="2" key={product.id}>
                <div className="cardStyle">
                  <ProductDetailsModal
                    key={product.id}
                    create={true}
                    product={product}
                    allProducts={recentOrders}
                    resetState={props.resetState}
                    descriptionDisplay={descriptionDisplay}
                    HandleButtonClick={HandleButtonClick}
                    count={count}
                    decrement={decrement}
                    increment={increment}
                  />
                </div>
              </Col>
            ))
          )}
        </Row>
      </Items>
    </div>
  );

  return (
    <Container>
      {orderPresent ? hasPreviousOrders() : noPreviousOrders()}
    </Container>
  );
};

export default connect(null, { logout, addToCart })(DashBoard);
