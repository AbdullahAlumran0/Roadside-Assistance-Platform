// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Initialize app and middleware
const app = express();
app.use(express.json()); // Parse JSON request bodies
app.use(cors()); // Enable CORS for cross-origin requests

// Connect to MongoDB
mongoose
    .connect('mongodb://localhost:27017/roadside-assistance', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Error connecting to MongoDB:', err));

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
    userID: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    carDetails: [carSchema], // Embed car schema for user-specific cars
});

const User = mongoose.model('User', userSchema);

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

// 3. Create a new request
app.post('/api/requests', async (req, res) => {
    try {
        const request = new Request(req.body);
        await request.save();
        res.status(201).json({ message: 'Request created successfully', request });
    } catch (error) {
        res.status(500).json({ message: 'Error creating request', error });
    }
});

// 4. Get all requests
app.get('/api/requests', async (req, res) => {
    try {
        const requests = await Request.find();
        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching requests', error });
    }
});

// 5. Update a request status
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

// 6. Fetch user information by userID
app.get('/api/users/:userID', async (req, res) => {
    try {
        const { userID } = req.params;
        const user = await User.findOne({ userID });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user information', error });
    }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
