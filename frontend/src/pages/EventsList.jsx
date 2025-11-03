import { useEffect, useState } from "react";
import EventCard from "../components/EventCard";
import { fetchEvents } from "../services/events"; // ADD THIS IMPORT

const EventsList = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadEvents = async () => {
            try {
                const eventsData = await fetchEvents();
                console.log('🔍 EVENTS DATA RECEIVED:', eventsData);
                console.log('🔍 First event details:', eventsData[0]);
                console.log('🔍 First event _id:', eventsData[0]?._id);
                console.log('🔍 First event id:', eventsData[0]?.id);
                setEvents(eventsData);
            } catch (err) {
                console.error("Error fetching events:", err);
            } finally {
                setLoading(false);
            }
        };
        loadEvents();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-dark mb-4">Upcoming Events</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Join our expert-led events to enhance your skills and advance your career.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* FIX: Change key from event.id to event._id */}
                    {events.map((event) => (
                        <EventCard key={event._id} event={event} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default EventsList;