import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link
import "./card.css";

const Homepage = () => {
    const [events, setEvents] = useState({
        upcomingEvents: [],
        ongoingEvents: [],
        completedEvents: []
    });

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get('http://localhost:8000/eventsAll');
                setEvents(response.data);
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        };

        fetchEvents();
    }, []);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const Card = ({ event }) => {
        return (
            <div className="card">
                <img src={`http://localhost:8000/${event.eventPoster}`} alt={event.eventName} />
                <h3>{event.eventName}</h3>
                <p style={{width:"280px"}}>{event.eventDescription}</p>
                <p>{formatDate(event.eventDate)}</p>
                <p>{event.eventTime}</p>
                <p>
                    <Link to={`/eventDetails/${event._id}/`}>
                        View More
                    </Link>
                </p>
            </div>
        );
    };

    return (
        <div className="homepage">
            <h2>Upcoming Events</h2>
            <div className="events">
                {events.upcomingEvents.map(event => (
                    <Card key={event._id} event={event} />
                ))}
            </div>
            <h2>Completed Events</h2>
            <div className="events">
                {events.ongoingEvents.map(event => (
                    <Card key={event._id} event={event} />
                ))}
            </div>
        </div>
    );
};

export default Homepage;
