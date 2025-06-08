import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./eventcss.css";

function CreateEvent() {
    const [eventData, setEventData] = useState({
        eventName: "",
        eventDate: "",
        eventTime: "",
        eventDescription: "",
        eventPoster: null, // Change to null to hold file
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEventData({
            ...eventData,
            [name]: value
        });
    };

    const handleFileChange = (e) => {
        setEventData({
            ...eventData,
            eventPoster: e.target.files[0], // Update to handle file
        });
    };

    const email = localStorage.getItem("email");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const { eventName, eventDate, eventTime, eventDescription, eventPoster } = eventData;

        // Create a FormData object to handle the file upload
        const formData = new FormData();
        formData.append('eventName', eventName);
        formData.append('eventDate', eventDate);
        formData.append('eventTime', eventTime);
        formData.append('eventDescription', eventDescription);
        formData.append('eventPoster', eventPoster);
        formData.append('email', email);

        try {
            const response = await axios.post('http://localhost:8000/createEvent', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const data = await response.data;
            setLoading(false);

            // Handle success
            alert('Event created successfully!');
            navigate(`/Events`); // Redirect to event details page

        } catch (error) {
            setLoading(false);
            console.error('Error creating event:', error);
            alert('Failed to create event. Please try again.');
        }
    };

    return (
        <div className='body1'>
            <div className='wraper'>
                <form onSubmit={handleSubmit}>
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
                    <button type="submit" disabled={loading}>{loading ? 'Creating Event...' : 'Create Event'}</button>
                    <div className='login-link'>
                        <p>Back to <Link to="/">Home</Link></p>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateEvent;
