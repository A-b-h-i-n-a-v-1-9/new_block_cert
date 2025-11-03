import mongoose from "mongoose";

const registrationSchema = new mongoose.Schema({
    eventId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Event", 
        required: true 
    },
    participantId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Participant", 
        required: true 
    },
    qrToken: { 
        type: String, 
        required: true 
    },
    tokenExpiry: { 
        type: Date, 
        required: true 
    },
    used: { 
        type: Boolean, 
        default: false 
    }
}, { 
    timestamps: true 
});

// Compound index to ensure unique registration per event
registrationSchema.index({ eventId: 1, participantId: 1 }, { unique: true });

export default mongoose.model("Registration", registrationSchema);