import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import Navbar from "./components/Navbar";
import { RPGProvider } from "./context/RPGContext";

function App() {
  return (
    <BrowserRouter>
      <RPGProvider>
        <Navbar />
      </RPGProvider>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);