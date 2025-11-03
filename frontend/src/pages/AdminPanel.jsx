import { useState, useEffect } from 'react';
import { mintCertificates, getNetworkInfo, getCertificates } from '../services/events';

const AdminPanel = () => {
  const [eventId, setEventId] = useState('');
  const [generating, setGenerating] = useState(false);
  const [systemInfo, setSystemInfo] = useState(null);
  const [results, setResults] = useState(null);
  const [certificates, setCertificates] = useState([]);

  useEffect(() => {
    loadSystemInfo();
    loadCertificates();
  }, []);

  const loadSystemInfo = async () => {
    try {
      const info = await getNetworkInfo();
      setSystemInfo(info);
    } catch (error) {
      console.error('Failed to load system info:', error);
      setSystemInfo({
        mode: 'LOCAL',
        status: 'System running in local mode'
      });
    }
  };

  const loadCertificates = async () => {
    try {
      const certs = await getCertificates();
      setCertificates(certs);
    } catch (error) {
      console.error('Failed to load certificates:', error);
    }
  };

  const handleGenerateCertificates = async (e) => {
    e.preventDefault();
    setGenerating(true);
    setResults(null);

    try {
      const response = await mintCertificates(eventId);
      setResults(response);
      await loadCertificates();
      alert('Certificates generated successfully!');
    } catch (error) {
      alert(`Certificate generation failed: ${error.message}`);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Admin Panel</h1>
        
        {/* System Info */}
        {systemInfo && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">System Information</h2>
            <div className="space-y-2">
              <div><span className="font-medium">Mode:</span> {systemInfo.mode}</div>
              <div><span className="font-medium">Status:</span> {systemInfo.status}</div>
              {systemInfo.features && (
                <div>
                  <span className="font-medium">Features:</span>
                  <ul className="list-disc list-inside ml-4">
                    {systemInfo.features.map((feature, index) => (
                      <li key={index} className="text-sm">{feature}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Generate Certificates */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Generate Certificates</h2>
            <form onSubmit={handleGenerateCertificates} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Event ID
                </label>
                <input
                  type="text"
                  value={eventId}
                  onChange={(e) => setEventId(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Enter event ID from your database"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Get event IDs from your database or events page
                </p>
              </div>
              <button
                type="submit"
                disabled={generating}
                className="w-full px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                {generating ? 'Generating...' : 'Generate Certificates for Attendees'}
              </button>
            </form>

            {results && (
              <div className="mt-6">
                <h3 className="font-semibold mb-2">Generation Results:</h3>
                <div className="bg-gray-100 p-4 rounded text-sm">
                  <p className="font-medium">{results.message}</p>
                  {results.results && (
                    <div className="mt-2">
                      <p>Processed {results.results.length} attendees</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Certificates List */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">
              Certificates ({certificates.length})
              <button 
                onClick={loadCertificates}
                className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200"
              >
                Refresh
              </button>
            </h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {certificates.map((cert) => (
                <div key={cert._id} className="border border-gray-200 rounded p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{cert.participantId?.name || 'Unknown'}</p>
                      <p className="text-sm text-gray-600">{cert.eventId?.name || 'Unknown Event'}</p>
                      <p className="text-xs text-gray-500">Cert ID: {cert.certId}</p>
                      <p className="text-xs text-gray-400">
                        Issued: {new Date(cert.issuedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      Generated
                    </span>
                  </div>
                </div>
              ))}
              {certificates.length === 0 && (
                <p className="text-gray-500 text-center py-4">No certificates generated yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;