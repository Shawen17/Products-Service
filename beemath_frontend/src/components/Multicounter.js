import React, { useState } from "react";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";

const MultiCounter = (props) => {
  const [count, setCount] = useState(0);

  const increment = () => {
    if (count < props.quantity) {
      setCount(count + 1);
      props.multiIncrement(count, props.item);
    }
  };

  const decrement = () => {
    if (count > 0) {
      setCount(count - 1);
      props.multiDecrement(count, props.item);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 5,
      }}
    >
      <button className="multi-counter" onClick={decrement}>
        <RemoveIcon style={{ fontSize: 16 }} />
      </button>
      <p
        style={{
          paddingTop: 13,
          fontSize: 18,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {count}
      </p>
      <button className="multi-counter" onClick={increment}>
        <AddIcon style={{ fontSize: 16 }} />
      </button>
    </div>
  );
};

export default MultiCounter;
