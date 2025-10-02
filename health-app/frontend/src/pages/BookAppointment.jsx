import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI, appointmentAPI } from '../services/api';

function BookAppointment() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      fetchAvailableSlots();
    }
  }, [selectedDoctor, selectedDate]);

  const fetchDoctors = async () => {
    try {
      const response = await userAPI.getAllDoctors();
      setDoctors(response.data);
    } catch (err) {
      setError('Failed to fetch doctors');
    }
  };

  const fetchAvailableSlots = async () => {
    try {
      const response = await appointmentAPI.getAvailableSlots(selectedDoctor, selectedDate);
      setAvailableSlots(response.data);
      setSelectedSlot('');
    } catch (err) {
      setError('Failed to fetch available slots');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await appointmentAPI.create({
        doctorId: selectedDoctor,
        dateTime: selectedSlot,
        duration: 30,
        reason,
      });
      setSuccess(true);
      setTimeout(() => navigate('/appointments'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to book appointment');
      setLoading(false);
    }
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    return maxDate.toISOString().split('T')[0];
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Book an Appointment</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          Appointment booked successfully! Redirecting to appointments...
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Select Doctor *
          </label>
          <select
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">-- Select a doctor --</option>
            {doctors.map((doctor) => (
              <option key={doctor.id} value={doctor.doctorProfile?.id}>
                Dr. {doctor.firstName} {doctor.lastName} - {doctor.doctorProfile?.specialization}
                {doctor.doctorProfile?.consultationFee && ` ($${doctor.doctorProfile.consultationFee})`}
              </option>
            ))}
          </select>
        </div>

        {selectedDoctor && (
          <>
            {doctors.find(d => d.doctorProfile?.id === selectedDoctor)?.doctorProfile?.bio && (
              <div className="mb-6 p-4 bg-gray-50 rounded">
                <p className="text-sm text-gray-700">
                  {doctors.find(d => d.doctorProfile?.id === selectedDoctor)?.doctorProfile?.bio}
                </p>
              </div>
            )}

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Select Date *
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={getMinDate()}
                max={getMaxDate()}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </>
        )}

        {selectedDate && availableSlots.length > 0 && (
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Select Time Slot *
            </label>
            <div className="grid grid-cols-4 gap-2">
              {availableSlots.map((slot) => {
                const time = new Date(slot.time).toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true,
                });
                return (
                  <button
                    key={slot.time}
                    type="button"
                    onClick={() => setSelectedSlot(slot.time)}
                    className={`py-2 px-3 rounded-md border ${
                      selectedSlot === slot.time
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {time}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {selectedDate && availableSlots.length === 0 && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-yellow-800">No available slots for this date. Please select another date.</p>
          </div>
        )}

        {selectedSlot && (
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Reason for Visit
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
              placeholder="Please describe the reason for your visit..."
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !selectedSlot}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Booking...' : 'Book Appointment'}
        </button>
      </form>
    </div>
  );
}

export default BookAppointment;