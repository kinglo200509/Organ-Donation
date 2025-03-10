import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./Sidebar"; // Importing Sidebar
import Home from "./Home";
import Blockchain from "./BlockChain";

function App() {
  return (
    <Router>
      <div className="flex h-screen">
        <Sidebar /> {/* Sidebar on the left */}
        <div className="flex-1 p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<h2>About Page</h2>} />
            <Route path="/contact" element={<h2>Contact Page</h2>} />
            <Route path="/services" element={<h2>Services Page</h2>} />
            <Route path="*" element={<h2>404 - Page Not Found</h2>} />
            <Route path="/Blockchain" element={<Blockchain/>}/>
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
