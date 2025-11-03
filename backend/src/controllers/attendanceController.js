import { verifyToken } from "../utils/crypto.js";
import Registration from "../models/Registration.js";
import Attendance from "../models/Attendance.js";
import { QR_TOKEN_EXPIRY_MINUTES } from "../keys.js";

export const scanAttendance = async (req, res) => {
    try {
        const { qrToken } = req.body;
        const decoded = verifyToken(qrToken);
        
        if (!decoded) return res.status(400).json({ error: "Invalid QR token" });
        
        const { eventId, participantId, timestamp } = decoded;

        // Check if token is expired (15 minutes from generation)
        const tokenAge = Date.now() - parseInt(timestamp);
        const maxAge = QR_TOKEN_EXPIRY_MINUTES * 60 * 1000; // Convert to milliseconds
        if (tokenAge > maxAge) {
            return res.status(400).json({ error: "Token expired" });
        }

        // find registration
        const reg = await Registration.findOne({ 
            eventId, 
            participantId, 
            qrToken 
        });
        
        if (!reg) return res.status(400).json({ error: "Registration not found" });
        if (reg.used) return res.status(400).json({ error: "Token already used" });

        // mark attendance
        await Attendance.create({ eventId, participantId });
        reg.used = true;
        await reg.save();

        res.json({ message: "Attendance marked successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};