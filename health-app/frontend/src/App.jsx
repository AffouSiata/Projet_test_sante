import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Profile from './pages/Profile';
import BookAppointment from './pages/BookAppointment';
import PatientAppointments from './pages/PatientAppointments';
import DoctorAppointments from './pages/DoctorAppointments';
import AdminDashboard from './pages/AdminDashboard';
import AdminDoctors from './pages/AdminDoctors';
import useAuthStore from './store/authStore';
import './App.css';

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
        <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />

        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<Home />} />
          <Route path="profile" element={<Profile />} />

          {/* Patient Routes */}
          <Route
            path="book-appointment"
            element={
              <PrivateRoute requiredRole="PATIENT">
                <BookAppointment />
              </PrivateRoute>
            }
          />
          <Route
            path="appointments"
            element={
              <PrivateRoute requiredRole="PATIENT">
                <PatientAppointments />
              </PrivateRoute>
            }
          />

          {/* Doctor Routes */}
          <Route
            path="doctor/appointments"
            element={
              <PrivateRoute requiredRole="DOCTOR">
                <DoctorAppointments />
              </PrivateRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="admin/dashboard"
            element={
              <PrivateRoute requiredRole="ADMIN">
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="admin/doctors"
            element={
              <PrivateRoute requiredRole="ADMIN">
                <AdminDoctors />
              </PrivateRoute>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;