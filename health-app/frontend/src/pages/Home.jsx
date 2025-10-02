import { Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';

function Home() {
  const { user } = useAuthStore();

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-4">Welcome, {user?.firstName}!</h1>
      <p className="text-xl text-gray-600 mb-8">You are logged in as {user?.role}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {user?.role === 'PATIENT' && (
          <>
            <Link
              to="/book-appointment"
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-semibold mb-2 text-blue-600">Book Appointment</h3>
              <p className="text-gray-600">Schedule a new appointment with a doctor</p>
            </Link>
            <Link
              to="/appointments"
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-semibold mb-2 text-green-600">My Appointments</h3>
              <p className="text-gray-600">View and manage your appointments</p>
            </Link>
            <Link
              to="/profile"
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-semibold mb-2 text-purple-600">My Profile</h3>
              <p className="text-gray-600">View and update your profile information</p>
            </Link>
          </>
        )}

        {user?.role === 'DOCTOR' && (
          <>
            <Link
              to="/doctor/appointments"
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-semibold mb-2 text-blue-600">My Appointments</h3>
              <p className="text-gray-600">View and manage patient appointments</p>
            </Link>
            <Link
              to="/profile"
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-semibold mb-2 text-purple-600">My Profile</h3>
              <p className="text-gray-600">Update your professional information</p>
            </Link>
          </>
        )}

        {user?.role === 'ADMIN' && (
          <>
            <Link
              to="/admin/dashboard"
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-semibold mb-2 text-blue-600">Dashboard</h3>
              <p className="text-gray-600">View statistics and recent activities</p>
            </Link>
            <Link
              to="/admin/doctors"
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-semibold mb-2 text-green-600">Manage Doctors</h3>
              <p className="text-gray-600">Add, edit, and remove doctor accounts</p>
            </Link>
            <Link
              to="/profile"
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-semibold mb-2 text-purple-600">My Profile</h3>
              <p className="text-gray-600">View your admin profile</p>
            </Link>
          </>
        )}
      </div>

      <div className="mt-12 p-6 bg-blue-50 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Quick Info</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold mb-2">Your Role</h3>
            <p className="text-gray-600">
              {user?.role === 'PATIENT' && 'You can book appointments and manage your health records'}
              {user?.role === 'DOCTOR' && 'You can manage appointments and patient consultations'}
              {user?.role === 'ADMIN' && 'You have full system administration privileges'}
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Account Status</h3>
            <p className="text-green-600">Active</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;