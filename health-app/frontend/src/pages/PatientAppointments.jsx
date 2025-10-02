import { useState, useEffect } from 'react';
import { appointmentAPI } from '../services/api';

function PatientAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await appointmentAPI.getPatientAppointments();
      setAppointments(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch appointments');
      setLoading(false);
    }
  };

  const handleCancel = async (appointmentId) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await appointmentAPI.cancelAppointment(appointmentId);
        fetchAppointments();
      } catch (err) {
        setError('Failed to cancel appointment');
      }
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

  const canCancel = (appointment) => {
    return (
      ['SCHEDULED', 'CONFIRMED'].includes(appointment.status) &&
      new Date(appointment.dateTime) > new Date()
    );
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">My Appointments</h1>

      {appointments.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-500">No appointments found.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {appointments.map((appointment) => (
            <div key={appointment.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <h3 className="text-xl font-semibold">
                      Dr. {appointment.doctor.user.firstName} {appointment.doctor.user.lastName}
                    </h3>
                    <span
                      className={`ml-4 px-3 py-1 rounded-full text-sm ${getStatusColor(
                        appointment.status
                      )}`}
                    >
                      {appointment.status}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-1">
                    Specialization: {appointment.doctor.specialization}
                  </p>
                  <p className="text-gray-600 mb-1">
                    Date: {new Date(appointment.dateTime).toLocaleDateString()}
                  </p>
                  <p className="text-gray-600 mb-1">
                    Time: {new Date(appointment.dateTime).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true,
                    })}
                  </p>
                  <p className="text-gray-600 mb-1">Duration: {appointment.duration} minutes</p>
                  {appointment.reason && (
                    <p className="text-gray-600 mb-1">Reason: {appointment.reason}</p>
                  )}
                  {appointment.notes && (
                    <p className="text-gray-600 mt-2">
                      <span className="font-semibold">Notes:</span> {appointment.notes}
                    </p>
                  )}
                </div>
                <div className="flex flex-col space-y-2">
                  {canCancel(appointment) && (
                    <button
                      onClick={() => handleCancel(appointment.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PatientAppointments;