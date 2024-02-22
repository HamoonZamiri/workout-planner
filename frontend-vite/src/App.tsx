import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useAuthContext } from "./hooks/context/useAuthContext";
import { Navbar } from "./components/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import RoutinePage from "./pages/Routine";
import { QueryClient, QueryClientProvider } from "react-query";

function App() {
  const context = useAuthContext();
  const user = context.state.user;

  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <div className="font-sans">
        <BrowserRouter>
          <Navbar />
          <div className="">
            <Routes>
              <Route
                path="/"
                element={user ? <RoutinePage /> : <Navigate to="/login" />}
              />
              <Route
                path="/login"
                element={!user ? <Login /> : <Navigate to="/" />}
              />
              <Route
                path="/signup"
                element={!user ? <Signup /> : <Navigate to="/" />}
              />
              <Route path="/routine" element={<RoutinePage />} />
            </Routes>
          </div>
        </BrowserRouter>
      </div>
    </QueryClientProvider>
  );
}

export default App;

