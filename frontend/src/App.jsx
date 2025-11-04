import { BrowserRouter, Route, Routes } from "react-router-dom"
import WatchList from "../../backend/models/WatchList"
import Watched from "./pages/Watched"
import Register from "./pages/Register"
import Login from "./pages/Login"
import Home from "./pages/Home"


function App() {
  

  return (
    
    <BrowserRouter>
<Routes>
    <Route path="/" element={<Home/>} />
    <Route path="/watchlist" element={<WatchList/>} />
    <Route path="/watched" element={<Watched/>} />
    <Route path="/register" element={<Register/>} /> 
    <Route path="/login" element={<Login/>} />
    </Routes>  
    
    </BrowserRouter>
    
  )
}

export default App
