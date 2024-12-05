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

// Save a new car to the server
async function confirmCarDetailsSelection() {
    const manufacturer = document.querySelector('input[placeholder="Manufacturer"]').value;
    const modelYear = document.querySelector('input[placeholder="Model Year"]').value;
    const vehicleModel = document.querySelector('input[placeholder="Vehicle Model"]').value;
    const vehicleColor = document.querySelector('input[placeholder="Vehicle Color"]').value;
    const plateLetters = document.querySelector('input[placeholder="Plate Letters"]').value;
    const plateNumber = document.querySelector('input[placeholder="Plate Number"]').value;

    if (manufacturer && modelYear && vehicleModel && vehicleColor && plateLetters && plateNumber) {
        const carDetails = {
            manufacturer,
            modelYear,
            vehicleModel,
            vehicleColor,
            plateLetters,
            plateNumber,
        };

        try {
            const response = await fetch(`${API_BASE_URL}/cars`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(carDetails),
            });

            if (response.ok) {
                alert('Car saved successfully!');
                fetchAndDisplayCars(); // Refresh the car list
                hideCarDetailsModal();
            } else {
                const errorData = await response.json();
                alert('Error saving car: ' + errorData.message);
            }
        } catch (error) {
            console.error('Error saving car:', error);
        }
    } else {
        alert('Please fill in all fields.');
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

// Add a new request to the server
async function addNewRequest() {
    const newRequestDetails = document.getElementById('newRequestDetails').value;

    if (newRequestDetails) {
        try {
            const response = await fetch(`${API_BASE_URL}/requests`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ details: newRequestDetails }),
            });

            if (response.ok) {
                alert('Request added successfully!');
                fetchAndDisplayRequests(); // Refresh the request list
                hideNewRequestModal();
            } else {
                const errorData = await response.json();
                alert('Error adding request: ' + errorData.message);
            }
        } catch (error) {
            console.error('Error adding request:', error);
        }
    } else {
        alert('Please enter request details.');
    }
}

// Update request status
async function updateRequestStatus(requestId, newStatus) {
    try {
        const response = await fetch(`${API_BASE_URL}/requests/${requestId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus }),
        });

        if (response.ok) {
            alert('Request status updated successfully!');
            fetchAndDisplayRequests(); // Refresh the request list
        } else {
            const errorData = await response.json();
            alert('Error updating request: ' + errorData.message);
        }
    } catch (error) {
        console.error('Error updating request:', error);
    }
}

// Toggle request details
function toggleDetails(cardId) {
    const card = document.getElementById(cardId);
    const details = card.querySelector('.details');
    const toggleBtn = card.querySelector('.toggle-btn');

    if (details.style.display === 'none') {
        details.style.display = 'block';
        toggleBtn.textContent = '▲';
    } else {
        details.style.display = 'none';
        toggleBtn.textContent = '▼';
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    fetchAndDisplayCars();
    fetchAndDisplayRequests();
});
