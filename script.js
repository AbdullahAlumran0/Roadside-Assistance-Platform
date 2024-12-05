// API Base URL
const API_BASE_URL = 'http://localhost:3000/api';

// Fetch and display all cars from the server
async function fetchAndDisplayCars() {
    const carDetails = document.getElementById('carDetails');
    carDetails.innerHTML = ''; // Clear existing content

    try {
        const response = await fetch(`${API_BASE_URL}/cars`);
        const cars = await response.json();

        if (cars.length > 0) {
            cars.forEach((car, index) => {
                const carInfo = `
                    Manufacturer: ${car.manufacturer} <br>
                    Model Year: ${car.modelYear} <br>
                    Vehicle Model: ${car.vehicleModel} <br>
                    Vehicle Color: ${car.vehicleColor} <br>
                    Plate Letters: ${car.plateLetters} <br>
                    Plate Number: ${car.plateNumber} <br>
                    <button onclick="goToCarDetails(${car._id})" style="background-color: #FBC767; color: #352F2F;">Select</button> <br><br>
                `;
                carDetails.innerHTML += carInfo;
            });
        } else {
            carDetails.innerHTML = 'No saved cars available.';
        }

        carDetails.style.display = 'block';
    } catch (error) {
        console.error('Error fetching cars:', error);
        carDetails.innerHTML = 'Error loading car details.';
    }
}

// Fetch user info based on userID
async function fetchUserInfo(userID) {
    const userDetailsDiv = document.getElementById('userDetails');
    userDetailsDiv.innerHTML = ''; // Clear previous details

    try {
        const response = await fetch(`${API_BASE_URL}/user/${userID}`);

        if (response.ok) {
            const user = await response.json();
            userDetailsDiv.innerHTML = `
                Name: ${user.name} <br>
                Phone: ${user.phone} <br>
                Email: ${user.email} <br>
                Car Details: <br>
                ${user.carDetails.map(car => `
                    Manufacturer: ${car.manufacturer} <br>
                    Model Year: ${car.modelYear} <br>
                    Vehicle Model: ${car.vehicleModel} <br>
                    Vehicle Color: ${car.vehicleColor} <br>
                    Plate Letters: ${car.plateLetters} <br>
                    Plate Number: ${car.plateNumber} <br><br>
                `).join('')}
            `;
        } else {
            userDetailsDiv.innerHTML = 'User not found';
        }
    } catch (error) {
        console.error('Error fetching user info:', error);
        userDetailsDiv.innerHTML = 'Error loading user details.';
    }
}

// View car details when selected
function goToCarDetails(carId) {
    const carDetails = document.getElementById('carDetails');
    carDetails.innerHTML = `Fetching car details for ID: ${carId}...`;
    // Optionally, fetch the specific car by ID for detailed information
}

// Fetch and display all requests from the server
async function fetchAndDisplayRequests() {
    const requestBox = document.querySelector('.request-box');
    requestBox.innerHTML = ''; // Clear existing content

    try {
        const response = await fetch(`${API_BASE_URL}/requests`);
        const requests = await response.json();

        if (requests.length > 0) {
            requests.forEach(request => {
                const requestCard = `
                    <div class="request-card">
                        <div class="request-header">
                            <span>Request: <span class="status">${request.status}</span></span>
                            <button class="toggle-btn" onclick="toggleDetails('${request._id}')">▼</button>
                        </div>
                        <div class="details" style="display: none;">
                            <p>${request.details}</p>
                        </div>
                    </div>
                `;
                requestBox.innerHTML += requestCard;
            });
        } else {
            requestBox.innerHTML = '<p>No requests found.</p>';
        }
    } catch (error) {
        console.error('Error fetching requests:', error);
        requestBox.innerHTML = '<p>Error loading requests.</p>';
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    fetchAndDisplayCars();
    fetchAndDisplayRequests();
    fetchUserInfo('someUserID'); // Replace 'someUserID' with the actual user ID
});
