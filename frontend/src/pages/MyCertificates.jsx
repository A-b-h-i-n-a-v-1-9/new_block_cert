import { useEffect, useState } from 'react';
import { getCertificates } from '../services/events';
import { verifyCertificate } from '../services/blockchain';

const MyCertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState({});

  useEffect(() => {
    const loadCertificates = async () => {
      try {
        const certs = await getCertificates();
        setCertificates(certs);
      } catch (error) {
        console.error('Error loading certificates:', error);
      } finally {
        setLoading(false);
      }
    };
    loadCertificates();
  }, []);

  const handleVerify = async (certId) => {
    setVerifying(prev => ({ ...prev, [certId]: true }));
    try {
      const blockchainCert = await verifyCertificate(certId);
      alert(`✅ Certificate verified on blockchain!\nStudent: ${blockchainCert.studentName}\nEvent: ${blockchainCert.eventId}`);
    } catch (error) {
      alert('❌ Certificate not found on blockchain');
    } finally {
      setVerifying(prev => ({ ...prev, [certId]: false }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">My Certificates</h1>
          <p className="text-xl text-gray-600">Your verified blockchain certificates</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certificates.map((cert) => (
            <div key={cert._id} className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 py-4 px-6">
                <h3 className="text-white text-lg font-semibold">{cert.eventId?.name || 'Event Certificate'}</h3>
              </div>
              <div className="p-6">
                <div className="space-y-3 mb-4">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Certificate ID:</span>
                    <p className="text-sm font-mono">{cert.certId || 'Not minted yet'}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Issued To:</span>
                    <p className="text-sm">{cert.participantId?.name || 'Unknown'}</p>
                  </div>
                  {cert.txHash && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">Transaction:</span>
                      <p className="text-sm font-mono truncate">{cert.txHash}</p>
                    </div>
                  )}
                </div>

                {cert.certId && (
                  <button
                    onClick={() => handleVerify(cert.certId)}
                    disabled={verifying[cert.certId]}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    {verifying[cert.certId] ? 'Verifying...' : 'Verify on Blockchain'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {certificates.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No certificates found.</p>
            <p className="text-gray-400">Attend events and get your certificates minted!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCertificates;