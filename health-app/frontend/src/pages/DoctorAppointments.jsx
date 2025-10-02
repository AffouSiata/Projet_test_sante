import { useState, useEffect } from 'react';
import { appointmentAPI } from '../services/api';

function DoctorAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingNotes, setEditingNotes] = useState(null);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await appointmentAPI.getDoctorAppointments();
      setAppointments(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch appointments');
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (appointmentId, status) => {
    try {
      await appointmentAPI.updateAppointment(appointmentId, { status });
      fetchAppointments();
    } catch (err) {
      setError('Failed to update appointment status');
    }
  };

  const handleNotesUpdate = async (appointmentId) => {
    try {
      await appointmentAPI.updateAppointment(appointmentId, { notes });
      setEditingNotes(null);
      setNotes('');
      fetchAppointments();
    } catch (err) {
      setError('Failed to update notes');
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
      case 'NO_SHOW':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const groupAppointmentsByDate = () => {
    const grouped = {};
    appointments.forEach((appointment) => {
      const date = new Date(appointment.dateTime).toLocaleDateString();
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(appointment);
    });
    return grouped;
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  const groupedAppointments = groupAppointmentsByDate();
  const sortedDates = Object.keys(groupedAppointments).sort(
    (a, b) => new Date(a) - new Date(b)
  );

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">My Appointments</h1>

      {appointments.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-500">No appointments scheduled.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {sortedDates.map((date) => (
            <div key={date}>
              <h2 className="text-xl font-semibold mb-3">{date}</h2>
              <div className="grid gap-4">
                {groupedAppointments[date].map((appointment) => (
                  <div key={appointment.id} className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <h3 className="text-lg font-semibold">
                            {appointment.patient.user.firstName} {appointment.patient.user.lastName}
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
                          Email: {appointment.patient.user.email}
                        </p>
                        <p className="text-gray-600 mb-1">
                          Phone: {appointment.patient.user.phone || 'N/A'}
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

                        <div className="mt-4">
                          {editingNotes === appointment.id ? (
                            <div>
                              <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows="3"
                                placeholder="Add notes..."
                              />
                              <div className="mt-2 space-x-2">
                                <button
                                  onClick={() => handleNotesUpdate(appointment.id)}
                                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => {
                                    setEditingNotes(null);
                                    setNotes('');
                                  }}
                                  className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              {appointment.notes && (
                                <p className="text-gray-600">
                                  <span className="font-semibold">Notes:</span> {appointment.notes}
                                </p>
                              )}
                              <button
                                onClick={() => {
                                  setEditingNotes(appointment.id);
                                  setNotes(appointment.notes || '');
                                }}
                                className="mt-2 text-blue-500 hover:underline"
                              >
                                {appointment.notes ? 'Edit Notes' : 'Add Notes'}
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2">
                        {appointment.status === 'SCHEDULED' && (
                          <>
                            <button
                              onClick={() => handleStatusUpdate(appointment.id, 'CONFIRMED')}
                              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(appointment.id, 'CANCELLED')}
                              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                        {appointment.status === 'CONFIRMED' && new Date(appointment.dateTime) < new Date() && (
                          <>
                            <button
                              onClick={() => handleStatusUpdate(appointment.id, 'COMPLETED')}
                              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                              Mark Complete
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(appointment.id, 'NO_SHOW')}
                              className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
                            >
                              No Show
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DoctorAppointments;