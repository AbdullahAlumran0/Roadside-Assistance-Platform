// Import required libraries
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { createVerification } = require('./vertification.js');
const { validateCode } = require('./validation.js');
// Initialize app
const app = express();

// Middleware (correct order)
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Connection
const uri = "mongodb+srv://moh:modeB522@road.73buh.mongodb.net/?retryWrites=true&w=majority&appName=Road";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Define Schema and Model
const dataSchema = new mongoose.Schema({
    name: String,
    email: String,
    age: Number
});
const Data = mongoose.model('Data', dataSchema);

// Define the Car schema and model
const carSchema = new mongoose.Schema({
    manufacturer: { type: String, required: true },
    modelYear: { type: String, required: true },
    vehicleModel: { type: String, required: true },
    vehicleColor: { type: String, required: true },
    plateLetters: { type: String, required: true },
    plateNumber: { type: String, required: true },
});

const Car = mongoose.model('Car', carSchema);

// Define the Request schema and model
const requestSchema = new mongoose.Schema({
    status: { type: String, default: 'Pending' },
    details: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

const Request = mongoose.model('Request', requestSchema);

// Define the User schema and model
const userSchema = new mongoose.Schema({
    userID: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    carDetails: [
        {
            manufacturer: String,
            modelYear: String,
            vehicleModel: String,
            vehicleColor: String,
            plateLetters: String,
            plateNumber: String,
        },
    ],
});

const User = mongoose.model('User', userSchema);

// Routes
app.get('/HomePage.HTML', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'HomePage.html'));
});
// Add this route along with your other routes
app.get('/HomePage.HTML', (req, res) => {
    console.log('Attempting to serve HomePage.HTML');
    const filePath = path.join(__dirname, 'public', 'HomePage.HTML');
    console.log('File path:', filePath);
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error('Error serving HomePage.HTML:', err);
            res.status(500).send('Error loading home page');
        }
    });
});
// Add Data
app.post('/add-data', async (req, res) => {
    try {
        const newData = new Data(req.body);
        const savedData = await newData.save();
        res.json({ message: 'Data added successfully', data: savedData });
    } catch (err) {
        res.status(500).json({ message: 'Error saving data', error: err });
    }
});

// Get Data
app.get('/get-data', async (req, res) => {
    try {
        const data = await Data.find();
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving data', error: err });
    }
});

// Serve Static Pages
app.get('/', (req, res) => res.sendFile(path.join(__dirname,'log-in.html')));
app.get('/HomePage.HTML', (req, res) => res.sendFile(path.join(__dirname, 'public', 'HomePage.HTML')));
app.get('/car', (req, res) => res.sendFile(path.join(__dirname, 'public', 'car.html')));
app.get('/requests', (req, res) => res.sendFile(path.join(__dirname, 'public', 'requests.html')));
app.get('/verify', (req, res) => res.sendFile(path.join(__dirname, 'verify.html')));
// API Routes
// 1. Create a new car
app.post('/api/cars', async (req, res) => {
    try {
        const car = new Car(req.body);
        await car.save();
        res.status(201).json({ message: 'Car saved successfully', car });
    } catch (error) {
        res.status(500).json({ message: 'Error saving car', error });
    }
});

// 2. Get all saved cars
app.get('/api/cars', async (req, res) => {
    try {
        const cars = await Car.find();
        res.status(200).json(cars);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching cars', error });
    }
});

// 3. Delete a car
app.delete('/api/cars/:id', async (req, res) => {
    try {
        console.log('Attempting to delete car with ID:', req.params.id);
        
        const deletedCar = await Car.findByIdAndDelete(req.params.id);
        
        if (!deletedCar) {
            console.log('Car not found with ID:', req.params.id);
            return res.status(404).json({ message: 'Car not found' });
        }
        
        console.log('Car deleted successfully:', deletedCar);
        res.status(200).json({ message: 'Car deleted successfully', deletedCar });
    } catch (error) {
        console.error('Error deleting car:', error);
        res.status(500).json({ message: 'Error deleting car', error: error.message });
    }
});

// 4. Create a new request
app.post('/api/requests', async (req, res) => {
    try {
        console.log('Received request body:', req.body);
        
        // Validate required fields
        if (!req.body.details) {
            return res.status(400).json({ message: 'Request details are required' });
        }

        const request = new Request({
            details: req.body.details,
            status: req.body.status || 'Pending',
            createdAt: new Date()
        });

        const savedRequest = await request.save();
        console.log('Request saved:', savedRequest);
        
        res.status(201).json(savedRequest);
    } catch (error) {
        console.error('Error creating request:', error);
        res.status(500).json({ 
            message: 'Error creating request', 
            error: error.message 
        });
    }
});

// 5. Get all requests
app.get('/api/requests', async (req, res) => {
    try {
        const requests = await Request.find();
        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching requests', error });
    }
});

// 6. Update a request status
app.patch('/api/requests/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const updatedRequest = await Request.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!updatedRequest) {
            return res.status(404).json({ message: 'Request not found' });
        }

        res.status(200).json({ message: 'Request updated successfully', updatedRequest });
    } catch (error) {
        res.status(500).json({ message: 'Error updating request', error });
    }
});

// 7. Fetch user info by userID
app.get('/api/user/:userID', async (req, res) => {
    try {
        const { userID } = req.params;
        const user = await User.findOne({ userID });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user info', error });
    }
});

// 8. Add a car to a user's carDetails
app.post('/api/user/:userID/cars', async (req, res) => {
    try {
        const { userID } = req.params;
        const car = new Car(req.body);

        const user = await User.findOneAndUpdate(
            { userID },
            { $push: { carDetails: car } },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(201).json({ message: 'Car added to user successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Error adding car to user', error });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        message: 'Something went wrong!', 
        error: err.message 
    });
});


app.post('/verify', async (req, res) => {   // for phone sms 
    const { phoneNumber } = req.body;
    
    try {
        await createVerification(phoneNumber);
        res.status(200).json({ message: 'Verification sent successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error sending verification', error: error.message });
    }
});
app.post('/verifyCode', async (req, res) => {
    const { code, phoneNumber } = req.body;

    try {
        const verificationStatus = await validateCode(code, phoneNumber);
        if (verificationStatus === 'approved') {
            res.status(200).json({ message: 'Verification successful' });
        } 
        // else {
        //     res.status(400).json({ message: 'Verification failed' });
        // }
    } catch (error) {
        res.status(500).json({ message: 'Error during verification', error: error.message });
    }
});


// Need a post for sms validation/moving to next page. (Logic already in the verify file just need the roles)

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
