// Import required libraries
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import path from 'path';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import express from 'express';
// import { validateCode } from './validation.js';
// import { createverification }  from './vertification.js';
// Initialize app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB connection
const uri = "mongodb+srv://moh:modeB522@road.73buh.mongodb.net/?retryWrites=true&w=majority&appName=Road";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Schemas and Models
const carSchema = new mongoose.Schema({
    manufacturer: String,
    modelYear: String,
    vehicleModel: String,
    vehicleColor: String,
    plateLetters: String,
    plateNumber: String
});
const Car = mongoose.model('Car', carSchema);

const requestSchema = new mongoose.Schema({
    status: { type: String, default: 'Pending' },
    details: String,
    createdAt: { type: Date, default: Date.now }
});
const Request = mongoose.model('Request', requestSchema);

const userSchema = new mongoose.Schema({
    userID: { type: String, required: true, unique: true },
    name: String,
    phone: String,
    email: String,
    carDetails: [carSchema],
    role: { type: Number, enum: [1, 2, 3], default: 1 } // 1 = user, 2 = admin, 3 = SP
});
const User = mongoose.model('User', userSchema);

// Middleware for JWT authentication
const authenticateJWT = (req, res, next) => {
    const token = req.headers.authorization;
    if (token) {
        jwt.verify(token, 'your_jwt_secret', (err, user) => {
            if (err) {
                return res.status(403).json({ message: 'Forbidden: Invalid token' });
            }
            req.user = user;
            next();
        });
    } else {
        res.status(401).json({ message: 'Unauthorized: No token provided' });
    }
};

// Middleware for role-based access control
const checkRole = (role) => (req, res, next) => {
    if (req.user && req.user.role === role) {
        next();
    } else {
        res.status(403).json({ message: 'Forbidden: You do not have the required role' });
    }
};

// Serve Static Pages
app.get('/', (req, res) => res.sendFile(path.join(__dirname,'log-in.HTML')));
app.get('/HomePage.HTML', (req, res) => res.sendFile(path.join(__dirname, 'public', 'HomePage.HTML')));
app.get('/car', (req, res) => res.sendFile(path.join(__dirname, 'public', 'car.html')));
app.get('/requests', (req, res) => res.sendFile(path.join(__dirname, 'public', 'requests.html')));
app.get('/verify.html', (req, res) => res.sendFile(path.join(__dirname,'verify.HTML')));

// API Endpoints

// Cars API
app.route('/api/cars')
    .post(authenticateJWT, checkRole(2), async (req, res) => { // Only admin (role = 2) can add cars
        try {
            const car = new Car(req.body);
            const savedCar = await car.save();
            res.status(201).json({ message: 'Car saved successfully', car: savedCar });
        } catch (err) {
            res.status(500).json({ message: 'Error saving car', error: err.message });
        }
    })
    .get(authenticateJWT, async (req, res) => {
        try {
            const cars = await Car.find();
            res.status(200).json(cars);
        } catch (err) {
            res.status(500).json({ message: 'Error fetching cars', error: err.message });
        }
    });

app.delete('/api/cars/:id', authenticateJWT, checkRole(2), async (req, res) => { // Only admin (role = 2) can delete cars
    try {
        const deletedCar = await Car.findByIdAndDelete(req.params.id);
        if (!deletedCar) return res.status(404).json({ message: 'Car not found' });
        res.status(200).json({ message: 'Car deleted successfully', deletedCar });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting car', error: err.message });
    }
});

// Requests API
app.route('/api/requests')
    .post(authenticateJWT, checkRole(2), async (req, res) => { // Only admin (role = 2) can create requests
        try {
            if (!req.body.details) return res.status(400).json({ message: 'Request details are required' });
            const request = new Request(req.body);
            const savedRequest = await request.save();
            res.status(201).json(savedRequest);
        } catch (err) {
            res.status(500).json({ message: 'Error creating request', error: err.message });
        }
    })
    .get(authenticateJWT, async (req, res) => {
        try {
            const requests = await Request.find();
            res.status(200).json(requests);
        } catch (err) {
            res.status(500).json({ message: 'Error fetching requests', error: err.message });
        }
    });

app.patch('/api/requests/:id', authenticateJWT, checkRole(2), async (req, res) => { // Only admin (role = 2) can update requests
    try {
        const updatedRequest = await Request.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
        if (!updatedRequest) return res.status(404).json({ message: 'Request not found' });
        res.status(200).json({ message: 'Request updated successfully', updatedRequest });
    } catch (err) {
        res.status(500).json({ message: 'Error updating request', error: err.message });
    }
});

// Users API
app.get('/api/user/:userID', authenticateJWT, async (req, res) => {
    try {
        const user = await User.findOne({ userID: req.params.userID });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching user', error: err.message });
    }
});

app.post('/api/user/:userID/cars', authenticateJWT, async (req, res) => {
    try {
        const car = req.body;
        const user = await User.findOneAndUpdate(
            { userID: req.params.userID },
            { $push: { carDetails: car } },
            { new: true }
        );
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(201).json({ message: 'Car added to user successfully', user });
    } catch (err) {
        res.status(500).json({ message: 'Error adding car to user', error: err.message });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
