import {
  Container,
  ProductList,
  ProductDetails,
  Info,
  H,
  Status,
} from "./OrderItems.style";

const OrderItems = ({ item }) => {
  const formatDate = (date) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    const newDate = new Date(date);
    return newDate.toLocaleDateString("en-US", options);
  };

  const deliveryStatus = (status) => {
    if (status === true) {
      return (
        <Status>
          <span className="badge bg-success">fullfilled</span>
        </Status>
      );
    } else {
      return (
        <Status>
          <span className="badge bg-warning text-dark">unfullfilled</span>
        </Status>
      );
    }
  };
  return (
    <Container>
      <Info>
        <H>Order_Ref</H>
        <>{item.ref}</>
      </Info>

      <ProductList>
        <ProductDetails>
          <H>Product_ID(s)</H>
          {item.Products?.product_ids &&
            item.Products.product_ids.map((item, index) => {
              return (
                <span style={{ fontSize: 16 }} key={item - index}>
                  {item}
                </span>
              );
            })}
        </ProductDetails>
        <ProductDetails>
          <H>Quantity</H>
          {item.Products?.quantities &&
            item.Products.quantities.map((item, index) => (
              <span style={{ fontSize: 16 }} key={item - index}>
                {item}
              </span>
            ))}
        </ProductDetails>
      </ProductList>
      <Info>
        <H>Order Date</H>
        <>{formatDate(item.OrderDate)}</>
      </Info>
      <Info>
        <H>Delivery</H>
        <>{item.Address}</>
      </Info>
      <Info>
        <H>Fullfillment</H>
        <>{deliveryStatus(item.Fullfillment)}</>
      </Info>
    </Container>
  );
};

export default OrderItems;
