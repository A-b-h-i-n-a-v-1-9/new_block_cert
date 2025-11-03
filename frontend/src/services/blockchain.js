import { ethers } from 'ethers';

const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;
const CONTRACT_ABI = [
  "function issueCertificate(string memory _studentName, string memory _eventId, string memory _ipfshash, address _issuedTo) external returns (uint256)",
  "function verifyCertificate(uint256 _certId) external view returns (tuple(uint256 certId, string studentName, string eventId, string ipfshash, address issuedTo, uint256 issuedAt))",
  "function certificates(uint256) external view returns (uint256 certId, string studentName, string eventId, string ipfshash, address issuedTo, uint256 issuedAt)",
  "event CertificateIssued(uint256 certId, string studentName, string eventId, string ipfshash, address issuedTo)"
];

export const connectWallet = async () => {
  if (window.ethereum) {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      return { provider, signer, address: await signer.getAddress() };
    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw new Error('Failed to connect wallet');
    }
  } else {
    throw new Error('Please install MetaMask');
  }
};

export const getCertificateContract = async () => {
  const { signer } = await connectWallet();
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
};

export const issueCertificate = async (studentName, eventId, ipfsHash, walletAddress) => {
  try {
    const contract = await getCertificateContract();
    const tx = await contract.issueCertificate(studentName, eventId, ipfsHash, walletAddress);
    const receipt = await tx.wait();
    
    // Find the CertificateIssued event
    const event = receipt.logs.find(log => 
      log.fragment && log.fragment.name === 'CertificateIssued'
    );
    
    if (event) {
      return {
        certId: event.args.certId.toString(),
        txHash: receipt.hash
      };
    }
    
    throw new Error('Certificate issuance event not found');
  } catch (error) {
    console.error('Error issuing certificate:', error);
    throw new Error('Failed to issue certificate on blockchain');
  }
};

export const verifyCertificate = async (certId) => {
  try {
    const contract = await getCertificateContract();
    const certificate = await contract.verifyCertificate(certId);
    return certificate;
  } catch (error) {
    console.error('Error verifying certificate:', error);
    throw new Error('Failed to verify certificate');
  }
};