const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/Usermodel');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path'); // Ensure path is imported
const Event = require('./models/EventModule');
const moment = require('moment');

const app = express();
const PORT = 8000;  

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use(cors({
    origin: [
        'http://localhost:3000',
    ],
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

const URI = "mongodb://localhost:27017CampusUnite";
mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log("DB connected successfully");
}).catch(err => console.error('MongoDB connection error:', err));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'default_secret', { expiresIn: '1h' });
        res.status(200).json({ token, user });
    } catch (error) {
        console.error('Login error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/register', async (req, res) => {
    const { name, collagename, branch, email, password } = req.body;
    try {
        // Check if the user already exists
        const userExist = await User.findOne({ email });
        if (userExist) {
            return res.status(422).json({ message: "User already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user instance
        const newUser = new User({
            name,
            collagename,
            branch,
            email,
            password: hashedPassword
        });

        // Save the user to the database
        await newUser.save();

        // Respond with a success message
        res.status(201).json({ message: "User registered successfully" });

    } catch (err) {
        console.error('Registration error:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/createEvent', upload.single('eventPoster'), async (req, res) => {
    const { eventName, eventDate, eventTime, eventDescription, email } = req.body;
    const eventPoster = req.file ? `uploads/${req.file.filename}` : null;

    try {
        const newEvent = new Event({
            eventName,
            eventDate,
            eventTime,
            eventDescription,
            eventPoster,
            email,
        });

        const savedEvent = await newEvent.save();
        res.status(201).json({ eventId: savedEvent._id });
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ message: 'Failed to create event' });
    }
});

app.get('/events', async (req, res) => {
    try {
        const { email } = req.query;

        let events;
        if (email) {
            // Fetch events filtered by user email
            events = await Event.find({ email: email });
        } else {
            // Fetch all events
            events = await Event.find();
        }

        res.json(events);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ error: 'Failed to fetch events' });
    }
});

app.delete('/EventDelete/:id', async (req, res) => {
    try {
        const deletedEvent = await Event.findByIdAndDelete(req.params.id);
        if (!deletedEvent) {
            return res.status(404).json({ error: 'Event not found' });
        }
        res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({ error: 'Failed to delete event' });
    }
});

app.get('/EditEvent/:id', async (req, res) => {
    const eventId = req.params.id;

    try {
        // Assuming you have an Event model/schema defined
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        // Respond with the event data
        res.json(event);
    } catch (error) {
        console.error('Error fetching event:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.put('/Edit/:eventId', upload.single('eventPoster'), async (req, res) => {
    const eventId = req.params.eventId;
    const eventData = req.body;

    // Handle updating event in your database or storage
    try {
        // Assuming you have a database model for events, update the event with eventId
        const updatedEvent = await Event.findByIdAndUpdate(eventId, {
            eventName: eventData.eventName,
            eventDate: eventData.eventDate,
            eventTime: eventData.eventTime,
            eventDescription: eventData.eventDescription,
            eventPoster: req.file ? req.file.path : eventData.eventPoster, // Check if new poster was uploaded
        }, { new: true });

        res.status(200).json(updatedEvent);
    } catch (error) {
        console.error('Error updating event:', error);
        res.status(500).json({ error: 'Could not update event' });
    }
});

app.get('/eventsAll', async (req, res) => {
    try {
        let events = await Event.find();

        // Separate events into upcoming, ongoing, and completed
        const now = moment();
        
        // Filter events
        const upcomingEvents = events.filter(event => moment(event.eventDate).isAfter(now));
        const ongoingEvents = events.filter(event => moment(event.eventDate).isSameOrBefore(now) && moment(event.eventEndDate).isSameOrAfter(now));
        const completedEvents = events.filter(event => moment(event.eventEndDate).isBefore(now));

        // Sort events
        upcomingEvents.sort((a, b) => moment(a.eventDate).diff(moment(b.eventDate)));
        ongoingEvents.sort((a, b) => moment(a.eventDate).diff(moment(b.eventDate)));
        completedEvents.sort((a, b) => moment(b.eventEndDate).diff(moment(a.eventEndDate)));

        res.json({
            upcomingEvents,
            ongoingEvents,
            completedEvents
        });
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ error: 'Failed to fetch events' });
    }
});

app.get('/userByEmail/:email', async (req, res) => {
    try {
        const userEmail = req.params.email;

        // Find user by email
        const user = await User.findOne({ email: userEmail });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('Error fetching user by email:', error);
        res.status(500).json({ error: 'Failed to fetch user' });
    }
});

// Route to fetch event details by ID
app.get('/event/:id', async (req, res) => {
    try {
        const eventId = req.params.id;

        // Find event by ID
        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        res.json(event);
    } catch (error) {
        console.error('Error fetching event by ID:', error);
        res.status(500).json({ error: 'Failed to fetch event' });
    }
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
