import Certificate from "../models/Certificate.js";
import Attendance from "../models/Attendance.js";
import Participant from "../models/Participant.js";
import Event from "../models/Event.js";
// import blockchainService from "../services/blockchainService.js";
// import blockchainService from "../services/blockchainService-test.js";
import blockchainService from "../services/blockchainService-robust.js";

export const getAllCertificates = async (req, res) => {
  try {
    const certs = await Certificate.find()
      .populate("eventId")
      .populate("participantId");
    res.json(certs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const mintCertificates = async (req, res) => {
  try {
    const { eventId } = req.body;
    
    // Get attendees for this event
    const attendees = await Attendance.find({ eventId })
      .populate('participantId')
      .populate('eventId');

    console.log(`🎯 Minting certificates for ${attendees.length} attendees`);

    const results = [];
    
    for (const attendance of attendees) {
      try {
        const participant = attendance.participantId;
        const event = attendance.eventId;
        
        if (!participant || !participant.walletAddress) {
          console.log(`⚠️ Skipping ${participant?.name} - no wallet address`);
          continue;
        }

        // For now, use a placeholder IPFS hash (in real app, upload to IPFS)
        const ipfsHash = `QmPlaceholderHashFor${participant._id}`;
        
        // Issue certificate on blockchain
        const blockchainResult = await blockchainService.issueCertificate(
          participant.name,
          event.name,
          ipfsHash,
          participant.walletAddress
        );

        // Save to database
        const certificate = await Certificate.create({
          eventId: event._id,
          participantId: participant._id,
          certId: blockchainResult.certId,
          walletAddress: participant.walletAddress,
          ipfsHash: ipfsHash,
          txHash: blockchainResult.txHash
        });

        results.push({
          participant: participant.name,
          certId: blockchainResult.certId,
          txHash: blockchainResult.txHash,
          status: 'success',
          explorerUrl: blockchainResult.explorerUrl
        });

        console.log(`✅ Certificate minted for ${participant.name}: ${blockchainResult.certId}`);
        
      } catch (error) {
        console.error(`❌ Failed to mint certificate for ${attendance.participantId?.name}:`, error);
        results.push({
          participant: attendance.participantId?.name || 'Unknown',
          error: error.message,
          status: 'failed'
        });
      }
    }

    res.json({
      message: `Minting process completed for ${results.length} certificates`,
      results: results
    });

  } catch (err) {
    console.error('❌ Minting process error:', err);
    res.status(500).json({ error: err.message });
  }
};

// New endpoint to verify a certificate
export const verifyCertificate = async (req, res) => {
  try {
    const { certId } = req.params;
    
    const blockchainData = await blockchainService.verifyCertificate(certId);
    
    // Also check our database
    const dbCertificate = await Certificate.findOne({ certId })
      .populate('eventId')
      .populate('participantId');

    res.json({
      blockchain: blockchainData,
      database: dbCertificate,
      verified: true
    });
  } catch (error) {
    res.status(404).json({ 
      error: 'Certificate not found or invalid',
      verified: false
    });
  }
};

// Network info endpoint
export const getNetworkInfo = async (req, res) => {
  try {
    const networkInfo = await blockchainService.getNetworkInfo();
    res.json({
      success: true,
      network: networkInfo,
      message: 'Connected to Polygon Amoy successfully!'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};