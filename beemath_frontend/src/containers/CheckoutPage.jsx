import React, { useState, useEffect } from "react";
import { Form, Input, Table } from "reactstrap";
// import { PaystackButton } from "react-paystack";
import axios from "axios";
import styled from "styled-components";
import { DateTime } from "luxon";
import { useNavigate, useLocation } from "react-router-dom";
import { checkout } from "../actions/auth";
import { connect } from "react-redux";
import { Container, Title, FormDisplay } from "./ContactUs";

const CheckInine = styled.div`
  display: flex;
  margin-top: 5px;
  color: black;
`;
const Info = styled.div`
  font-size: 15px;

  @media screen and (max-width: 600px) {
    font-size: 12px;
  }
`;

require("dotenv").config();

const CheckoutPage = (props) => {
  const location = useLocation();
  const [clicked, setClicked] = useState(false);
  const [checked, setChecked] = useState(false);
  const [inputs, setInputs] = useState({});
  const [locations, setLocations] = useState({
    items: {
      areas: [
        {
          id: 0,
          state: "",
          city: "",
          charge: 0,
          door_delivery_charge: 0,
          zone: "",
        },
      ],
      amount: 0,
    },
  });

  document.title = "checkout";
  const email = props.user.email;
  const all_items = location.state ? JSON.parse(location.state) : [];
  let { product_ids, quantities, product_items } = all_items;
  const items = { product_ids, quantities };

  useEffect(() => {
    const body = JSON.stringify({ email });
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.getItem("access")}`,
        Accept: "application/json",
      },
    };
    axios
      .put("/api/checkout/", body, config)
      .then((res) => setLocations({ items: res.data }));
  }, [email]);

  const user_state = localStorage.getItem("state");
  var total;

  let filteredLocations = locations.items.areas.filter(
    (area) => area.state.toLowerCase() === user_state.toLowerCase()
  );

  let filtredCity = filteredLocations.filter(
    (city) => city.city === inputs.select
  );
  if (inputs.select) {
    var logistics = filtredCity[0].charge;
  }

  const productAmount = locations.items.amount.total;
  const amount = parseInt(productAmount);

  if (checked) {
    var door_delivery = filtredCity[0].door_delivery_charge;

    total = amount + parseInt(logistics) + door_delivery;
  } else {
    total = amount + parseInt(logistics);
  }

  const navigate = useNavigate();

  const handleChecked = (e) => {
    if (inputs.select) {
      setChecked(e.target.checked);
    }
  };

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const HandleSubmit = async (event) => {
    event.preventDefault();
    setClicked(true);
  };

  const MakePayment = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.getItem("access")}`,
        Accept: "application/json",
      },
    };

    const body = {
      OrderStatus: "Queued",
      Products: items,
      CustomerID: email,
      State: props.user.state,
      Address: inputs.address,
      PhoneNumber: inputs.phone,
      OrderDate: DateTime.now().setZone("America/Toronto").toISO(),
      Amount: total,
    };
    const product_body = { item: product_items, ordered_by: email };
    try {
      await axios.post("http://localhost:8082/api/orders/new", body, config);
      const res = await axios.post(
        "api/initiate-payment/",
        product_body,
        config
      );
      if (res.status === 201)
        alert("Thanks for doing business with us! Come back soon!!");
      props.checkout();
      navigate("/products");
    } catch (err) {
      console.log(err.message);
    }
  };

  // const componentProps = {
  //   email: email,
  //   amount: total * 100,
  //   publicKey: process.env.REACT_APP_PAYSTACK_PUBLIC_KEY,
  //   text: "Pay Now",
  //   onSuccess: () => {
  //     const body = JSON.stringify({
  //       OrderStatus: "Queued",
  //       Products: product_items,
  //       CustomerID: props.user.id,
  //       State: props.user.state,
  //       Address: inputs.address,
  //       PhoneNumber: inputs.phone,
  //       OrderDate: DateTime.now().setZone("America/Toronto"),
  //       Amount: total,
  //     });

  //     const config = {
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `JWT ${localStorage.getItem("access")}`,
  //         Accept: "application/json",
  //       },
  //     };
  //     axios.post("api/initiate-payment/", body, config);
  //     alert("Thanks for doing business with us! Come back soon!!");
  //     props.checkout();
  //     navigate("/products");
  //   },

  //   onClose: () => alert("Wait! You need these awesome items, don't go!!!!"),
  // };

  const formDisplay = {
    width: "100%",
  };

  const checkboxDisplay = {
    verticalAlign: "middle",
    position: "relative",
    bottom: "1px",
    marginRight: "3px",
  };

  const deliveryDetailView = (
    <div>
      <Title> Provide delivery details </Title>
      <Input
        className="mt-3"
        placeholder="Phone number"
        name="phone"
        type="number"
        value={inputs.phone || ""}
        onChange={handleChange}
        required
      />
      <Input
        className="mt-3"
        type="select"
        name="select"
        id="exampleSelect"
        value={inputs.select || ""}
        onChange={handleChange}
        required
      >
        <option value="">select city</option>
        {filteredLocations.map((location) => (
          <option key={location.id} value={location.city}>
            {location.city}
          </option>
        ))}
      </Input>
      <Input
        className="mt-3"
        placeholder="Full Address.."
        name="address"
        type="textarea"
        value={inputs.address || ""}
        onChange={handleChange}
        required
      />
      {user_state.toLowerCase() !== "lagos" ? (
        <CheckInine>
          <Input
            type="checkbox"
            style={checkboxDisplay}
            name="check"
            value={inputs.check || false}
            onChange={handleChecked}
          />
          <Info>
            door-delivery(attracts additional charges but currently unavailable)
          </Info>
        </CheckInine>
      ) : (
        ""
      )}
      <button className="checkout-button" type="submit">
        proceed to checkout
      </button>
    </div>
  );

  const makePaymentView = (
    <div>
      <p>Order breakdown</p>
      <Table
        borderless
        style={{ borderRadius: "6px", backgroundColor: "#D9DDDC" }}
      >
        <tbody>
          <tr>
            <td>Logistics :</td>
            <td>₦{logistics}</td>
          </tr>
          <tr>
            <td>Amount :</td>
            <td>₦{amount}</td>
          </tr>
          {checked ? (
            <tr>
              <td>Door delivery :</td>
              <td>₦{door_delivery}</td>
            </tr>
          ) : (
            ""
          )}

          <tr style={{ fontWeight: "bold" }}>
            <td>Total :</td>
            <td>₦{total}</td>
          </tr>
        </tbody>
      </Table>

      {/* <div className="mt-8">
        <PaystackButton className="paystack-button" {...componentProps} />
      </div> */}
      <div className="mt-8">
        <button className="paystack-button" onClick={MakePayment}>
          PAY NOW
        </button>
      </div>
    </div>
  );

  return (
    <Container>
      <FormDisplay>
        <Form style={formDisplay} onSubmit={HandleSubmit}>
          {clicked ? makePaymentView : deliveryDetailView}
        </Form>
      </FormDisplay>
    </Container>
  );
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

export default connect(mapStateToProps, { checkout })(CheckoutPage);
