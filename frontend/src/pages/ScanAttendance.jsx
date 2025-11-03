import { useState } from 'react';
import { scanAttendance } from '../services/events';

const ScanAttendance = () => {
  const [qrToken, setQrToken] = useState('');
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);

  const handleScan = async (e) => {
    e.preventDefault();
    setScanning(true);
    setResult(null);

    try {
      const response = await scanAttendance(qrToken);
      setResult({ success: true, message: response.message });
      setQrToken(''); // Clear after successful scan
    } catch (error) {
      setResult({ success: false, message: error.message });
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-green-600 to-blue-600 py-6 px-8">
          <h1 className="text-2xl font-bold text-white text-center">Scan Attendance</h1>
          <p className="text-white text-center mt-2 uppercase text-sm tracking-wider">
            QR Code Scanner
          </p>
        </div>

        <form onSubmit={handleScan} className="p-8 space-y-6">
          <div>
            <label htmlFor="qrToken" className="block text-sm font-medium text-gray-700">
              QR Token
            </label>
            <textarea
              id="qrToken"
              name="qrToken"
              required
              value={qrToken}
              onChange={(e) => setQrToken(e.target.value)}
              rows="4"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm"
              placeholder="Paste QR token here..."
            />
          </div>

          <button
            type="submit"
            disabled={scanning}
            className="w-full px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
          >
            {scanning ? 'Scanning...' : 'Scan Attendance'}
          </button>
        </form>

        {result && (
          <div className={`p-4 mx-8 mb-8 rounded-lg ${
            result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {result.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default ScanAttendance;