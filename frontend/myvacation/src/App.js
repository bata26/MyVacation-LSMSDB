import React from "react";
import {
 BrowserRouter as Router,
 Routes,
 Route,
} from "react-router-dom";
import SignIn from "./pages/signIn";
import ResponsiveAppBar from "./components/navBar.js";
import {useEffect} from 'react';
import SignUp from "./pages/signUp";
import Profile from "./pages/profile";
import Home from "./pages/home";
import Checkout from "./pages/checkout";
import Search from "./pages/search";
import EditAccomodation from "./pages/editAccomodation";
import EditActivity from "./pages/editActivity";
import AdminPage from "./pages/adminPage/adminPage";
import InsertAccomodation from "./pages/insertAccomodation";
import  Accomodation from "./pages/accomodation";
import  Activity from "./pages/activity";
import InsertActivity from "./pages/insertActivity";
import MyAdv from "./pages/myAdv";
import ToApprove from "./pages/toApprove";

function App() {
  useEffect(() => {
    document.body.style.margin = 0;

    return () => {  };
  }, []);

  return (
      <>
        <ResponsiveAppBar />
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/myadv" element={<MyAdv />} />
            <Route path="/search" element={<Search />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/accomodation/:accomodationID" element={<Accomodation />} />
            {
                localStorage.getItem("role") === "admin" &&
                <Route path="/toApprove/:advertisementID" element={<ToApprove />} />
            }
            <Route path="/insert/accomodation" element={<InsertAccomodation />} />
            <Route path="/insert/activity" element={<InsertActivity />} />
            <Route path="/edit/accomodation/:accomodationID" element={<EditAccomodation />} />
            <Route path="/edit/activity/:activityID" element={<EditActivity />} />
            <Route path="/activity/:activityID" element={<Activity />} />
            <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </>
  );
}

export default App;