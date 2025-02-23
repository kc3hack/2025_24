import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import axios from "axios";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Question from "./pages/Question";
import Result from "./pages/Result";
import Footer from "./components/Footer";
import { UserProvider } from './context/UserContext';

const API_URL = process.env.REACT_APP_BACKEND_URL;

function AppContent() {
  const location = useLocation(); // 現在のページURLを取得

  // Footerを表示するページ
  const showFooter = location.pathname === "/" || location.pathname === "/profile";

  return (
    <div className="App" style={{ background: "none" }}>

      {/* ルーティング設定 */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/question/:id" element={<Question />} />
        <Route path="/result" element={<Result />} />
      </Routes>

      {/* Home と Profile のみ Footer を表示 */}
      {showFooter && <Footer />}
    </div>
  );
}

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios
      .get(`${API_URL}/auth/verify`)
      .then((response) => {
        setMessage(response.data);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  }, []);

  return (
    <UserProvider>
    <Router>
      {message && <h1>{message}</h1>}
      <AppContent />
    </Router>
    </UserProvider>
  );
}

export default App;