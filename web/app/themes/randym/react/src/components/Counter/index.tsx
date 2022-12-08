import React, { useState } from "react";
import classes from "./style.module.css";

export const Counter = () => {
  const [count, setCount] = useState(0);
  return (
    <div>
      <button className={classes.btn} onClick={() => setCount(count + 1)}>
        +
      </button>
      <span>{count}</span>
      <button className={classes.btn} onClick={() => setCount(count - 1)}>
        -
      </button>
    </div>
  );
};
