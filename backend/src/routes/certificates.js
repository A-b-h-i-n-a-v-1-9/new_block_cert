// backend/src/routes/certificates.js
import express from "express";
import { 
  getAllCertificates, 
  mintCertificates, 
  verifyCertificate, 
  getNetworkInfo 
} from "../controllers/certificateController.js";
import { validateMintCertificates } from "../utils/validator.js";

const router = express.Router();

// GET /api/certificates - Get all certificates
router.get("/", getAllCertificates);

// POST /api/certificates/mint - Generate certificates for event attendees
router.post("/mint", validateMintCertificates, mintCertificates);

// GET /api/certificates/verify/:certId - Verify a certificate
router.get("/verify/:certId", verifyCertificate);

// GET /api/certificates/network-info - Get system information
router.get("/network-info", getNetworkInfo);

export default router;