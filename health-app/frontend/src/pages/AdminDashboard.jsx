import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../services/api';

function AdminDashboard() {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      const response = await adminAPI.getStatistics();
      setStatistics(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch statistics');
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'SCHEDULED':
        return 'bg-blue-100 text-blue-800';
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      case 'COMPLETED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Total Patients</h3>
          <p className="text-3xl font-bold text-blue-600">{statistics?.totalPatients || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Total Doctors</h3>
          <p className="text-3xl font-bold text-green-600">{statistics?.totalDoctors || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Total Appointments</h3>
          <p className="text-3xl font-bold text-purple-600">{statistics?.totalAppointments || 0}</p>
        </div>
      </div>

      <div className="mb-6">
        <Link
          to="/admin/doctors"
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 inline-block"
        >
          Manage Doctors
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Recent Appointments</h2>
        {statistics?.recentAppointments?.length === 0 ? (
          <p className="text-gray-500">No recent appointments</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3">Patient</th>
                  <th className="text-left py-2 px-3">Doctor</th>
                  <th className="text-left py-2 px-3">Date & Time</th>
                  <th className="text-left py-2 px-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {statistics?.recentAppointments?.map((appointment) => (
                  <tr key={appointment.id} className="border-b">
                    <td className="py-2 px-3">
                      {appointment.patient.user.firstName} {appointment.patient.user.lastName}
                    </td>
                    <td className="py-2 px-3">
                      Dr. {appointment.doctor.user.firstName} {appointment.doctor.user.lastName}
                    </td>
                    <td className="py-2 px-3">
                      {new Date(appointment.dateTime).toLocaleString()}
                    </td>
                    <td className="py-2 px-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                          appointment.status
                        )}`}
                      >
                        {appointment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;