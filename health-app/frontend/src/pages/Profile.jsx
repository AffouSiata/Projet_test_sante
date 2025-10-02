import { useState, useEffect } from 'react';
import { userAPI } from '../services/api';
import useAuthStore from '../store/authStore';

function Profile() {
  const { user } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await userAPI.getProfile();
      setProfile(response.data);
      setFormData(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch profile');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Client-side phone validation
    if (formData.phone && formData.phone.trim()) {
      const phoneRegex = /^[\+]?[1-9][\d]{9,16}$/;
      if (!phoneRegex.test(formData.phone.replace(/[\s\-\(\)]/g, ''))) {
        setError('Phone number must be 10-17 digits and may start with +');
        return;
      }
    }

    try {
      let response;
      if (user.role === 'PATIENT') {
        const updateData = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone?.replace(/[\s\-\(\)]/g, ''), // Clean phone number
          address: formData.patientProfile?.address,
          dateOfBirth: formData.patientProfile?.dateOfBirth,
          allergies: formData.patientProfile?.allergies,
          bloodType: formData.patientProfile?.bloodType,
          medicalHistory: formData.patientProfile?.medicalHistory,
        };
        response = await userAPI.updatePatientProfile(updateData);
      } else if (user.role === 'DOCTOR') {
        const updateData = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone?.replace(/[\s\-\(\)]/g, ''), // Clean phone number
          bio: formData.doctorProfile?.bio,
          yearsOfExperience: parseInt(formData.doctorProfile?.yearsOfExperience) || undefined,
          consultationFee: parseFloat(formData.doctorProfile?.consultationFee) || undefined,
        };
        response = await userAPI.updateDoctorProfile(updateData);
      }
      setProfile(response.data);
      setFormData(response.data);
      setEditing(false);
      setError(null);
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.data?.errors) {
        const errorMessages = err.response.data.errors.map(e => e.message).join(', ');
        setError(errorMessages);
      } else {
        setError('Failed to update profile');
      }
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mb-4 shadow-lg">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold gradient-text mb-2">My Profile</h1>
        <p className="text-gray-600">Manage your personal information</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg animate-pulse">
          <div className="flex">
            <svg className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="card space-y-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName || ''}
              onChange={handleChange}
              disabled={!editing}
              className={editing ? "input-field" : "input-field bg-gray-50"}
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName || ''}
              onChange={handleChange}
              disabled={!editing}
              className={editing ? "input-field" : "input-field bg-gray-50"}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
            <input
              type="email"
              value={profile?.email || ''}
              disabled
              className="w-full px-3 py-2 border rounded-md bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone || ''}
              onChange={handleChange}
              disabled={!editing}
              placeholder="+1234567890 or 1234567890"
              className={editing ? "input-field" : "input-field bg-gray-50"}
            />
            {editing && (
              <p className="text-xs text-gray-500 mt-1">
                Format: 10-17 digits, optionally starting with +
              </p>
            )}
          </div>
        </div>

        {user.role === 'PATIENT' && formData.patientProfile && (
          <>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Address</label>
              <textarea
                name="patientProfile.address"
                value={formData.patientProfile.address || ''}
                onChange={handleChange}
                disabled={!editing}
                className={editing ? "input-field" : "input-field bg-gray-50"}
                rows="2"
              />
            </div>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Date of Birth</label>
                <input
                  type="date"
                  name="patientProfile.dateOfBirth"
                  value={formData.patientProfile.dateOfBirth?.split('T')[0] || ''}
                  onChange={handleChange}
                  disabled={!editing}
                  className={editing ? "input-field" : "input-field bg-gray-50"}
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Blood Type</label>
                <input
                  type="text"
                  name="patientProfile.bloodType"
                  value={formData.patientProfile.bloodType || ''}
                  onChange={handleChange}
                  disabled={!editing}
                  className={editing ? "input-field" : "input-field bg-gray-50"}
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Allergies</label>
                <input
                  type="text"
                  name="patientProfile.allergies"
                  value={formData.patientProfile.allergies || ''}
                  onChange={handleChange}
                  disabled={!editing}
                  className={editing ? "input-field" : "input-field bg-gray-50"}
                />
              </div>
            </div>
          </>
        )}

        {user.role === 'DOCTOR' && formData.doctorProfile && (
          <>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Specialization</label>
                <input
                  type="text"
                  value={formData.doctorProfile.specialization || ''}
                  disabled
                  className="w-full px-3 py-2 border rounded-md bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">License Number</label>
                <input
                  type="text"
                  value={formData.doctorProfile.licenseNumber || ''}
                  disabled
                  className="w-full px-3 py-2 border rounded-md bg-gray-100"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Bio</label>
              <textarea
                name="doctorProfile.bio"
                value={formData.doctorProfile.bio || ''}
                onChange={handleChange}
                disabled={!editing}
                className={editing ? "input-field" : "input-field bg-gray-50"}
                rows="3"
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Years of Experience</label>
                <input
                  type="number"
                  name="doctorProfile.yearsOfExperience"
                  value={formData.doctorProfile.yearsOfExperience || ''}
                  onChange={handleChange}
                  disabled={!editing}
                  className={editing ? "input-field" : "input-field bg-gray-50"}
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Consultation Fee ($)</label>
                <input
                  type="number"
                  name="doctorProfile.consultationFee"
                  value={formData.doctorProfile.consultationFee || ''}
                  onChange={handleChange}
                  disabled={!editing}
                  className={editing ? "input-field" : "input-field bg-gray-50"}
                />
              </div>
            </div>
          </>
        )}

        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          {!editing ? (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span>Edit Profile</span>
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => {
                  setEditing(false);
                  setFormData(profile);
                  setError(null);
                }}
                className="btn-secondary flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>Cancel</span>
              </button>
              <button
                type="submit"
                className="btn-primary flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Save Changes</span>
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
}

export default Profile;