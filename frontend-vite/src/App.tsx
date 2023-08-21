import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useAuthContext } from "./hooks/useAuthContext";
import { Navbar } from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function App() {
  const { state } = useAuthContext();
  const { user } = state;
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