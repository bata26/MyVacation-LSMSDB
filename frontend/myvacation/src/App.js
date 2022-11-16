import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import SignIn from "./pages/signIn";
import Accomodation from "./pages/accomodation";
import ResponsiveAppBar from "./components/navBar.js";
import { useEffect } from 'react';
import SignUp from "./pages/signUp";
import Profile from "./pages/profile";
import Home from "./pages/home/home"
import Checkout from "./pages/checkout/checkout"
import Search from "./pages/search"
import AdminPage from "./pages/adminPage/adminPage";
import Chart from "./pages/adminPage/chart";

function App() {
  useEffect(() => {
    document.body.style.margin = 0;

    return () => {  };
  }, []);

  return (
    <Router>
      <ResponsiveAppBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/accomodation/:accomodationID" element={<Accomodation />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/search" element={<Search />} />
      </Routes>
    </Router>
  );
}

export default App;