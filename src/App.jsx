import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/Login";
import Chat from "./pages/Chat";

function RequireAuth({ children }){
  const token = localStorage.getItem("jwt");
  return token ? children : <Navigate to="/login"/>
}

export default function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/chat"
          element={
            <RequireAuth>
              <Chat />
            </RequireAuth>
          }
        />
        <Route path="*" element={<Navigate to="/chat" />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />

      </Routes>
    </BrowserRouter>
  );
}


