import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import PatientDashboard from "./pages/PatientDashboard";
import Profile from "./pages/Profile";
import BookAppointment from "./pages/BookAppointment";
import MyBookings from "./pages/MyBookings";
import PaymentGateway from "./pages/PaymentGateway";
import DoctorDashboard from "./pages/DoctorDashboard";
import DoctorPendingRequests from "./pages/DoctorPendingRequests";
import DoctorConsultations from "./pages/DoctorConsultations";
import DoctorHistory from "./pages/DoctorHistory";
import DoctorFeedbacks from "./pages/DoctorFeedbacks";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Patient Routes */}
          <Route path="/patient" element={<ProtectedRoute allowedRole="PATIENT"><Layout /></ProtectedRoute>}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<PatientDashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="book" element={<BookAppointment />} />
            <Route path="bookings" element={<MyBookings />} />
          </Route>

          {/* Special case: Payment without Layout */}
          <Route path="/patient/payment-gateway" element={<ProtectedRoute allowedRole="PATIENT"><PaymentGateway /></ProtectedRoute>} />

          {/* Doctor Routes */}
          <Route path="/doctor" element={<ProtectedRoute allowedRole="DOCTOR"><Layout /></ProtectedRoute>}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DoctorDashboard />} />
            <Route path="pending" element={<DoctorPendingRequests />} />
            <Route path="consultations" element={<DoctorConsultations />} />
            <Route path="history" element={<DoctorHistory />} />
            <Route path="profile" element={<Profile />} />
            <Route path="feedbacks" element={<DoctorFeedbacks />} />
          </Route>

          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;