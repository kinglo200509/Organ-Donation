import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./Sidebar"; // Importing Sidebar
import Home from "./Home";
import OrganSearch from "./OrganSearch";
import Blockchain from "./BlockChain";
import AddPatient from "./pages/AddPatient";  // New
import ViewPatients from "./pages/ViewPatients";  // New
import NextPatient from "./pages/NextPatient";  // New
import Patients from "./Patients";

function App() {
  return (
    <Router>
      <div className="flex h-screen">
        <Sidebar /> {/* Sidebar on the left */}
        <div className="flex-1 p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<h2>About Page</h2>} />
            <Route path="/patients" element={<Patients />} />
            <Route path="/contact" element={<h2>Contact Page</h2>} />
            <Route path="/organ-search" element={<OrganSearch/>} />
            <Route path="/Blockchain" element={<h2>hello</h2>} />
            <Route path="*" element={<h2>404 - Page Not Found</h2>} />

            {/* New Routes */}
            <Route path="/add-patient" element={<AddPatient />} />
            <Route path="/view-patients" element={<ViewPatients />} />
            <Route path="/next-patient" element={<NextPatient />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
