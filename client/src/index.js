import React from "react";

import { render } from "react-dom";

import "./style.css";

const App = () => {
  return (
    <div className="app">
      <h1 className="navbar-title">Basic Image Sharer</h1>
    </div>
  );
};

render(<App />, document.getElementById("root"));
