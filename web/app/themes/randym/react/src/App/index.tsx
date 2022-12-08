import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import { useStore } from "../store";
import { Counter } from "../components/Counter";
import { Title } from "../components/Title";

export const App = () => {
  const { name } = useStore();

  return (
    <>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/contact">Contact</Link>
      </nav>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Title name={name} />
              <Counter />
            </>
          }
        ></Route>
        <Route path="/contact" element={<h1>Contact</h1>}></Route>
      </Routes>
    </>
  );
};
