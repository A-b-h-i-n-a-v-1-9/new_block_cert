import api from './api';

export const registerForEvent = async (eventId, payload) => {
  try {
    console.log('Registering for event:', eventId, 'with data:', payload);
    
    const response = await api.post(`/registrations/${eventId}/register`, payload);
    console.log('Registration successful:', response.data);
    
    return {
      ...response.data,
      token: response.data.qrToken
    };
  } catch (error) {
    console.error('Registration failed with details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw new Error('Registration failed. Please try again.');
  }
};

export const fetchEvents = async () => {
  try {
    const response = await api.get('/events');
    console.log('Events from backend:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch events from backend:', error);
    // Return empty array instead of mock data
    return [];
  }
};

export const getCertificates = async () => {
  try {
    const response = await api.get('/certificates');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch certificates:', error);
    return [];
  }
};

export const mintCertificates = async (eventId) => {
  try {
    const response = await api.post('/certificates/mint', { eventId });
    return response.data;
  } catch (error) {
    console.error('Minting failed:', error);
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw new Error('Certificate generation failed');
  }
};

export const getNetworkInfo = async () => {
  try {
    const response = await api.get('/certificates/network-info');
    return response.data;
  } catch (error) {
    console.error('Failed to get system info:', error);
    return {
      mode: 'LOCAL',
      status: 'System running in local mode'
    };
  }
};

export const verifyCertificate = async (certId) => {
  try {
    const response = await api.get(`/certificates/verify/${certId}`);
    return response.data;
  } catch (error) {
    console.error('Verification failed:', error);
    throw new Error('Certificate verification failed');
  }
};

export const scanAttendance = async (qrToken) => {
  try {
    const response = await api.post('/attendance/scan', { qrToken });
    return response.data;
  } catch (error) {
    console.error('Attendance scan failed:', error);
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw new Error('Attendance scan failed. Please try again.');
  }
};