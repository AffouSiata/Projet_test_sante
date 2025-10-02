import { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';

function AdminDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    specialization: '',
    licenseNumber: '',
    bio: '',
    yearsOfExperience: '',
    consultationFee: '',
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await adminAPI.getAllDoctors();
      setDoctors(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch doctors');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'yearsOfExperience' || name === 'consultationFee' ? Number(value) : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDoctor) {
        await adminAPI.updateDoctor(editingDoctor.id, formData);
      } else {
        await adminAPI.createDoctor(formData);
      }
      setShowAddForm(false);
      setEditingDoctor(null);
      resetForm();
      fetchDoctors();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save doctor');
    }
  };

  const handleEdit = (doctor) => {
    setEditingDoctor(doctor);
    setFormData({
      email: doctor.email,
      password: '',
      firstName: doctor.firstName,
      lastName: doctor.lastName,
      phone: doctor.phone || '',
      specialization: doctor.doctorProfile?.specialization || '',
      licenseNumber: doctor.doctorProfile?.licenseNumber || '',
      bio: doctor.doctorProfile?.bio || '',
      yearsOfExperience: doctor.doctorProfile?.yearsOfExperience || '',
      consultationFee: doctor.doctorProfile?.consultationFee || '',
    });
    setShowAddForm(true);
  };

  const handleDelete = async (doctorId) => {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      try {
        await adminAPI.deleteDoctor(doctorId);
        fetchDoctors();
      } catch (err) {
        setError('Failed to delete doctor');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      phone: '',
      specialization: '',
      licenseNumber: '',
      bio: '',
      yearsOfExperience: '',
      consultationFee: '',
    });
  };

  const handleViewAppointments = async (doctorId) => {
    try {
      const response = await adminAPI.getDoctorAppointments(doctorId);
      console.log('Doctor appointments:', response.data);
      alert(`Doctor has ${response.data.length} appointments. Check console for details.`);
    } catch (err) {
      setError('Failed to fetch appointments');
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Doctors</h1>
        <button
          onClick={() => {
            setShowAddForm(true);
            setEditingDoctor(null);
            resetForm();
          }}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Add New Doctor
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {showAddForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">
            {editingDoctor ? 'Edit Doctor' : 'Add New Doctor'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">First Name *</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Last Name *</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={editingDoctor}
                />
              </div>
              {!editingDoctor && (
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Password *</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required={!editingDoctor}
                  />
                </div>
              )}
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Specialization *
                </label>
                <input
                  type="text"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  License Number *
                </label>
                <input
                  type="text"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={editingDoctor}
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Years of Experience
                </label>
                <input
                  type="number"
                  name="yearsOfExperience"
                  value={formData.yearsOfExperience}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Consultation Fee ($)
                </label>
                <input
                  type="number"
                  name="consultationFee"
                  value={formData.consultationFee}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-gray-700 text-sm font-bold mb-2">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-4 mt-6">
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingDoctor(null);
                  resetForm();
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                {editingDoctor ? 'Update' : 'Add'} Doctor
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-4">
        {doctors.map((doctor) => (
          <div key={doctor.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">
                  Dr. {doctor.firstName} {doctor.lastName}
                </h3>
                <p className="text-gray-600 mb-1">Email: {doctor.email}</p>
                <p className="text-gray-600 mb-1">Phone: {doctor.phone || 'N/A'}</p>
                <p className="text-gray-600 mb-1">
                  Specialization: {doctor.doctorProfile?.specialization}
                </p>
                <p className="text-gray-600 mb-1">
                  License: {doctor.doctorProfile?.licenseNumber}
                </p>
                <p className="text-gray-600 mb-1">
                  Experience: {doctor.doctorProfile?.yearsOfExperience || 'N/A'} years
                </p>
                <p className="text-gray-600 mb-1">
                  Consultation Fee: ${doctor.doctorProfile?.consultationFee || 'N/A'}
                </p>
                {doctor.doctorProfile?.bio && (
                  <p className="text-gray-600 mt-2">Bio: {doctor.doctorProfile.bio}</p>
                )}
                <p className="text-gray-500 mt-2 text-sm">
                  Total Appointments: {doctor.doctorProfile?.appointments?.length || 0}
                </p>
              </div>
              <div className="flex flex-col space-y-2">
                <button
                  onClick={() => handleViewAppointments(doctor.doctorProfile?.id)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  View Appointments
                </button>
                <button
                  onClick={() => handleEdit(doctor)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(doctor.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminDoctors;