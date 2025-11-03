import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { registerForEvent } from '../services/events';
import QRModal from '../components/QRModal';
import Loader from '../components/Loader';

const Register = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    walletAddress: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [registrationToken, setRegistrationToken] = useState('');
  const [eventId, setEventId] = useState('');

  useEffect(() => {
    console.log('Event ID from URL params:', id);
    if (id && id !== 'undefined') {
      setEventId(id);
    } else {
      console.error('Invalid event ID in URL:', id);
      alert('Invalid event. Please go back and try again.');
      navigate('/');
    }
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!eventId || eventId === 'undefined') {
      alert('Invalid event. Please go back and try again.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      console.log('Registering for event:', eventId, 'with data:', formData);
      
      const response = await registerForEvent(eventId, formData);
      console.log('Registration response:', response);
      
      const token = response.qrToken || response.token;
      setRegistrationToken(token);
      
      // Save to localStorage
      const myEvents = JSON.parse(localStorage.getItem('myEvents') || '[]');
      localStorage.setItem('myEvents', JSON.stringify([
        ...myEvents,
        { 
          eventId: eventId, 
          ...formData, 
          token: token, 
          date: new Date().toISOString() 
        }
      ]));
      
      setShowQRModal(true);
    } catch (error) {
      console.error('Registration failed:', error);
      alert(`Registration failed: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ADD THIS FUNCTION - Handle modal close with redirect
  const handleModalClose = () => {
    setShowQRModal(false);
    // Redirect to events page after 1 second
    setTimeout(() => {
      navigate('/');
    }, 1000);
  };

  if (!eventId || eventId === 'undefined') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Event Not Found</h2>
          <p className="text-gray-600 mb-4">The event ID is missing or invalid.</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  if (isSubmitting) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-6 px-8">
          <h1 className="text-2xl font-bold text-white text-center">Qdemy</h1>
          <p className="text-white text-center mt-2 uppercase text-sm tracking-wider">
            Event Registration
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Bhumi Hada"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="bhumi@example.com"
            />
          </div>

          <div>
            <label htmlFor="walletAddress" className="block text-sm font-medium text-gray-700">
              Wallet Address
            </label>
            <input
              type="text"
              id="walletAddress"
              name="walletAddress"
              required
              value={formData.walletAddress}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 font-mono"
              placeholder="0x71C7...32d1"
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Complete Registration
            </button>
          </div>
        </form>
      </div>

      {/* UPDATE: Use the new handleModalClose function */}
      <QRModal 
        isOpen={showQRModal}
        onClose={handleModalClose}  // Changed this line
        token={registrationToken}
        userName={formData.name}
        eventId={eventId}
      />
    </div>
  );
};

export default Register;