import React from "react";
import {
 BrowserRouter as Router,
 Routes,
 Route,
 useNavigate
} from "react-router-dom";
import Home  from "./pages/home";
import  SignIn from "./pages/signIn";
import ResponsiveAppBar from "./components/navBar.js";
import {useEffect} from 'react';

import SignUp from "./pages/signUp";

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
      </Routes>
    </Router>
  );
}

export default App;