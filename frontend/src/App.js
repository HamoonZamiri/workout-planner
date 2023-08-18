import React from "react"
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom"

//components
import Home from "./pages/Home"
import {Navbar} from "./components/Navbar"
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { useAuthContext } from "./hooks/useAuthContext";


function App() {
  const { user } = useAuthContext();
  return (
    <div className="font-sans">
      <BrowserRouter>
      <Navbar />
      <div className="">
        <Routes>
          <Route
            path="/"
            element={user ? <Home /> : <Navigate to="/login" />}
          />
          <Route
            path="/login"
            element={!user ? <Login /> : <Navigate to="/" />}
          />
          <Route
            path="/signup"
            element={!user ? <Signup />: <Navigate to="/" />}
          />
        </Routes>

      </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
