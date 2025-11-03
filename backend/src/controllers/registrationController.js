import Registration from "../models/Registration.js";
import Participant from "../models/Participant.js";
import Event from "../models/Event.js";
import { generateToken } from "../utils/crypto.js";
import { QR_TOKEN_EXPIRY_MINUTES } from "../keys.js";

export const registerParticipant = async (req, res) => {
    try {
        const { eventId } = req.params;
        const { name, email, walletAddress } = req.body;

        const event = await Event.findById(eventId);
        if (!event) return res.status(400).json({ error: "Event not found" });

        // find or create participant
        let participant = await Participant.findOne({ email });
        if (!participant) {
            participant = await Participant.create({ name, email, walletAddress });
        }

        // generate signed QR token using your crypto util
        const token = generateToken(eventId, participant._id.toString());
        
        // Calculate expiry based on your configuration
        const expiry = new Date(Date.now() + QR_TOKEN_EXPIRY_MINUTES * 60 * 1000);

        // save registration
        const registration = await Registration.create({
            eventId,
            participantId: participant._id,
            qrToken: token,
            tokenExpiry: expiry,
            used: false
        });

        res.status(201).json({
            message: "Registered successfully",
            registrationId: registration._id,
            qrToken: token,
            expiresIn: `${QR_TOKEN_EXPIRY_MINUTES} minutes`
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};