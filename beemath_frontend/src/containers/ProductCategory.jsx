import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Row, Col } from "reactstrap";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import styled from "styled-components";
import ProductDetailsModal from "../components/ProductDetailsModal";
import { logout, addToCart } from "../actions/auth";
import { descriptionDisplay } from "./Products";
import Pagination from "../components/Pagination";

const Header = styled.div`
  height: 40px;
  background-color: whitesmoke;
  font-size: 17px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  box-shadow: 2px 4px 8px 0 rgba(0, 0, 0, 0.2);
`;

require("dotenv").config();
let PageSize = 6;

const ProductCategory = (props) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [count, setCount] = useState(0);
  const [products, setProducts] = useState({ items: [] });
  const email = localStorage.getItem("email");
  const token = localStorage.getItem("access");
  const navigate = useNavigate();

  const { category } = useParams();

  useEffect(() => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };
    axios
      .get("/api/products/", config)
      .then((res) => setProducts({ items: res.data }));
  }, []);

  const increment = (num) => {
    setCount(num + 1);
  };

  const decrement = (num) => {
    if (num > 0) {
      setCount(num - 1);
    }
  };

  const Capitalize = (value) => {
    const result = value[0].toUpperCase() + value.slice(1);
    return result;
  };

  const HandleButtonClick = async (product) => {
    if (token != null) {
      props.addToCart(email, product, count);
      alert(`${count} ${product.description} added to cart`);
      setCount(0);
    } else {
      navigate("/login");
    }
  };

  const filteredProducts = useMemo(() => {
    const filtered = products.items.filter(function (product) {
      return product.category.includes(category);
    });
    return filtered;
  }, [products, category]);

  const uniqueProducts = filteredProducts.filter(
    (elem, index) =>
      filteredProducts.findIndex(
        (obj) => obj.description === elem.description
      ) === index
  );

  const currentData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    return uniqueProducts.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, uniqueProducts]);

  return (
    <div className="container-fluid" style={{ marginTop: "110px" }}>
      <Header>{Capitalize(category)}</Header>

      <Row className="mt-3" style={{ borderRadius: 6, border: "1px" }}>
        {!products.items || products.items.length <= 0 ? (
          <div width="50%" height="80%" className="text-center">
            <img src="/loading.gif" alt="loading.." />
          </div>
        ) : (
          currentData.map((product) => (
            <Col xs="6" sm="6" md="3" lg="2" key={product.id}>
              <ProductDetailsModal
                key={product.id}
                create={true}
                product={product}
                allProducts={filteredProducts}
                descriptionDisplay={descriptionDisplay}
                HandleButtonClick={HandleButtonClick}
                count={count}
                decrement={decrement}
                increment={increment}
              />
            </Col>
          ))
        )}
      </Row>
      <Pagination
        className="pagination mt-5"
        currentPage={currentPage}
        totalCount={filteredProducts.length}
        pageSize={PageSize}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
};
const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { addToCart, logout })(ProductCategory);
