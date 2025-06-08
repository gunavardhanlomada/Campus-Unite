import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';


function MyEvents() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Fetch events when component mounts
        const userEmail = localStorage.getItem('email');
        if (userEmail) {
            fetchEvents(userEmail);
        }
    }, []);

    const fetchEvents = async (email) => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:8000/events?email=${email}`);
            setEvents(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching events:', error);
            setLoading(false);
        }
    };

    const handleDelete = async (eventId) => {
        try {
            const response = await axios.delete(`http://localhost:8000/EventDelete/${eventId}`);
            console.log(response); // Log response for debugging
            if (response) {
                window.location.reload(false); // Reload page after deletion
            }
        } catch (error) {
            console.error('Error deleting event:', error);
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const EventCard = ({ event }) => (
        <div className="card mb-3" style={{ maxWidth: '540px' }}>
            <div className="row g-0">
                <div className="col-md-4">
                    <img
                        src={`http://localhost:8000/${event.eventPoster}`}
                        className="img-fluid rounded-start"
                        alt={event.eventName}
                        style={{ height: '100%', width: '100%', objectFit: 'cover' }}
                    />
                </div>
                <div className="col-md-8">
                    <div className="card-body">
                        <h5 className="card-title">{event.eventName}</h5>
                        <p className="card-text">{event.eventDescription}</p>
                        <p className="card-text">{event.eventTime}</p>
                        <p className="card-text">{formatDate(event.eventDate)}</p>
                        <p className="card-text">
                            <small className="text-muted">Last updated {new Date().toLocaleTimeString()}</small>
                        </p>
                    </div>
                </div>
            </div>
            <div className="card-footer">
                <Link to={`/edit/${event._id}`} className="btn btn-outline-primary me-2">Edit</Link>
                <button className="btn btn-outline-danger" onClick={() => handleDelete(event._id)}>Delete</button>
            </div>
        </div>
    );

    return (
        <div className="events-page">
            <center><h1>Events</h1></center>
            {loading ? (
                <p>Loading events...</p>
            ) : events.length === 0 ? (
                <p>No events found for this email.</p>
            ) : (
                <div className="events-list">
                    {events.map(event => (
                        <EventCard key={event._id} event={event} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default MyEvents;
