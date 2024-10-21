import React from "react";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";

const Counter = (props) => {
  const quantityLimit = props.count < props.quantity;

  return (
    <div>
      <span className="counter mb-3">
        <button
          className="counter-button"
          onClick={() => {
            props.decrement(props.count);
          }}
        >
          <RemoveIcon />
        </button>
        <span style={{ padding: 6 }}> {props.count} </span>
        {quantityLimit ? (
          <button
            className="counter-button"
            onClick={() => {
              props.increment(props.count);
            }}
          >
            {" "}
            <AddIcon />{" "}
          </button>
        ) : (
          <button style={{ borderRadius: 4, backgroundColor: "grey" }} disabled>
            <AddIcon />
          </button>
        )}
        <span> ({props.count} items(s) added) </span>
      </span>
    </div>
  );
};

export default Counter;
