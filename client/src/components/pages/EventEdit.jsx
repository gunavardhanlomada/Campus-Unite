import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import "./eventcss.css"

function EventEdit() {
    const { eventId } = useParams(); // Retrieve eventId from URL parameter
    const [eventData, setEventData] = useState({
        eventName: '',
        eventDate: '',
        eventTime: '',
        eventDescription: '',
        eventPoster: null,
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchEvent(eventId);
    }, [eventId]);

    const fetchEvent = async (id) => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:8000/EditEvent/${id}`);
            setEventData(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching event:', error);
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEventData({
            ...eventData,
            [name]: value,
        });
    };

    const handleFileChange = (e) => {
        setEventData({
            ...eventData,
            eventPoster: e.target.files[0],
        });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('eventName', eventData.eventName);
            formData.append('eventDate', eventData.eventDate);
            formData.append('eventTime', eventData.eventTime);
            formData.append('eventDescription', eventData.eventDescription);
            formData.append('eventPoster', eventData.eventPoster);

            const response = await axios.put(`http://localhost:8000/Edit/${eventId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log(response.data); // Log the updated event data
            setLoading(false);
            alert("Succesfull")
            navigate("/")

        } catch (error) {
            console.error('Error updating event:', error);
            setLoading(false);
        }
    };

    if (loading) {
        return <p>Loading event details...</p>;
    }

    return (
        <div className='body1'>
            <div className='wraper'>
                <form onSubmit={handleFormSubmit}>
                    <h1>Create an Event</h1>
                    <div className="input-box">
                        <input
                            type="text"
                            placeholder='Event Name'
                            name="eventName"
                            value={eventData.eventName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="input-box">
                        <input
                            type="date"
                            placeholder='Event Date'
                            name="eventDate"
                            value={eventData.eventDate}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="input-box">
                        <input
                            type="time"
                            placeholder='Event Time'
                            name="eventTime"
                            value={eventData.eventTime}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="input-box">
                        <textarea
                            placeholder='Event Description'
                            name="eventDescription"
                            value={eventData.eventDescription}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <br />
                    <div className='File'>
                        <label style={{paddingRight:"10px"}}>Event Poster</label>
                        <input
                            type="file"
                            name="eventPoster"
                            accept="image/*"
                            onChange={handleFileChange}
                            required
                        />
                    </div>
                    <button type="submit" disabled={loading}>{loading ? 'Updating Event...' : 'Update Event'}</button>
                    <div className='login-link'>
                        <p>Back to <Link to="/">Home</Link></p>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EventEdit;
