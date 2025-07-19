import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import DonorRegistration from "./pages/DonorRegistration";
import HospitalRegistration from "./pages/HospitalRegistration";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Navbar />
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/donate"
            element={
              <ProtectedRoute requiredRole="DONOR">
                <Navbar />
                <div className="p-8 text-center">
                  Donate Page - Coming Soon!
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Navbar />
                <div className="p-8 text-center">
                  Profile Page - Coming Soon!
                </div>
              </ProtectedRoute>
            }
          />
          <Route path="/register/donor" element={<DonorRegistration />} />
          <Route path="/register/hospital" element={<HospitalRegistration />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
