import React from "react";
import ReactDOM from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { urlPath, typeComponent, initialState } from "./argv";
import * as Components from "./components";
import { App } from "./App";

let Cmp: (x: any) => JSX.Element;
if (typeComponent === "App") {
  Cmp = App;
  const result = ReactDOM.renderToString(
    <StaticRouter location={urlPath}>
      <Cmp />
    </StaticRouter>
  );

  console.log(result);
} else {
  type Keys = keyof typeof Components;
  Cmp = Components[typeComponent as Keys] as typeof Cmp;

  const result = ReactDOM.renderToString(
    // <StaticRouter location={urlPath}>
    <Cmp {...initialState} />
    // </StaticRouter>
  );

  console.log(result);
}
