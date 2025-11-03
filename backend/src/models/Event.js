import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    description: String,
    date: { 
        type: Date, 
        required: true 
    },
    venue: String,  // Changed from 'location' to match your routes
    capacity: Number,
    createdBy: { 
        type: String, 
        required: true 
    },
}, { 
    timestamps: true 
});

export default mongoose.model("Event", eventSchema);