import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import WatchList from "./pages/WatchList";
import Watched from "./pages/Watched";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Movie from "./pages/Movie";
import Profile from "./pages/Profile";


function AppContent() {
  const location = useLocation();


  const hideNavbar = ["/login", "/register"].includes(location.pathname);

  return (
    <>
      {!hideNavbar && <Navbar />}

      <div className={!hideNavbar}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/watchlist" element={<WatchList />} />
          <Route path="/watched" element={<Watched />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/movie/:id" element={<Movie/>} />
          <Route path="/profile" element={<Profile/>} />
        </Routes>
      </div>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
