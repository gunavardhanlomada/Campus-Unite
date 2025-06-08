import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBBtn,
} from 'mdb-react-ui-kit';


const EventDetails = () => {
    const { eventId } = useParams(); // Extracts eventId from URL params
    const [eventDetails, setEventDetails] = useState(null);
    const [userDetails, setUserDetails] = useState(null); // State to hold user details

    useEffect(() => {
        const fetchEventDetails = async () => {
            try {
                // Fetch event details
                const eventResponse = await axios.get(`http://localhost:8000/event/${eventId}`);
                setEventDetails(eventResponse.data);

                // Fetch user details using eventDetails.email
                const userResponse = await axios.get(`http://localhost:8000/userByEmail/${eventResponse.data.email}`);
                setUserDetails(userResponse.data);
            } catch (error) {
                console.error('Error fetching event or user details:', error);
            }
        };

        fetchEventDetails();
    }, [eventId]); // Fetch details when eventId changes

    if (!eventDetails || !userDetails) {
        return <div>Loading event details...</div>;
    }

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <section style={{ backgroundColor: '#eee' }}>
            <MDBContainer className="py-5">
                <MDBRow>
                    <MDBCol lg="4">
                        <MDBCard className="mb-4">
                            <MDBCardBody className="text-center">
                                <MDBCardImage
                                    src={`http://localhost:8000/${eventDetails.eventPoster}`}
                                    alt={eventDetails.eventName}
                                    style={{ width: '250px' }}
                                    fluid
                                />
                                <p className="text-muted mb-4">{eventDetails.eventName}</p>
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                    <MDBCol lg="8">
                        <MDBCard className="mb-4">
                            <MDBCardBody>
                                <MDBRow>
                                    <MDBCol sm="3">
                                        <strong>Event Name</strong>
                                    </MDBCol>
                                    <MDBCol sm="9">
                                        <p>{eventDetails.eventName}</p>
                                    </MDBCol>
                                </MDBRow>
                                <hr />
                                <MDBRow>
                                    <MDBCol sm="3">
                                        <strong>Event Description</strong>
                                    </MDBCol>
                                    <MDBCol sm="9">
                                        <p>{eventDetails.eventDescription}</p>
                                    </MDBCol>
                                </MDBRow>
                                <hr />
                                <MDBRow>
                                    <MDBCol sm="3">
                                        <strong>Date</strong>
                                    </MDBCol>
                                    <MDBCol sm="9">
                                        <p>{formatDate(eventDetails.eventDate)}</p> {/* Fix: Pass eventDetails.eventDate directly */}
                                    </MDBCol>
                                </MDBRow>
                                <hr />
                                <MDBRow>
                                    <MDBCol sm="3">
                                        <strong>Time</strong>
                                    </MDBCol>
                                    <MDBCol sm="9">
                                        <p>{eventDetails.eventTime}</p>
                                    </MDBCol>
                                </MDBRow>
                                <hr/>
                                <MDBRow>
                                    <MDBCol sm="3">
                                        <strong>Collage</strong>
                                    </MDBCol>
                                    <MDBCol sm="9">
                                        <p>{userDetails.collagename}</p>
                                    </MDBCol>
                                </MDBRow>
                                <hr/>
                                <MDBRow>
                                    <MDBCol sm="3">
                                        <strong>Branch</strong>
                                    </MDBCol>
                                    <MDBCol sm="9">
                                        <p>{userDetails.branch}</p>
                                    </MDBCol>
                                </MDBRow>
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        </section>
    );
};

export default EventDetails;
