// Globals
const API_BASE_URL = 'http://localhost:3000/api';

// Modal Functions
function showNewRequestModal() {
    const modal = document.getElementById('newRequestModal');
    modal.style.display = 'flex';
}

function hideNewRequestModal() {
    document.getElementById('newRequestModal').style.display = 'none';
}

function showServiceOffersModal() {
    document.getElementById('serviceOffersModal').style.display = 'block';
}

function hideServiceOffersModal() {
    document.getElementById('serviceOffersModal').style.display = 'none';
}

function showCarDetailsModal() {
    document.getElementById('carDetailsModal').style.display = 'block';
}

function hideCarDetailsModal() {
    document.getElementById('carDetailsModal').style.display = 'none';
}

// Request Functions
async function addNewRequest() {
    // Log the form data being collected
    const service1Details = document.getElementById('service1Details').textContent;
    const service2 = document.querySelector('input[placeholder="Service 2 (optional)"]').value;
    const service3 = document.querySelector('input[placeholder="Service 3 (optional)"]').value;
    const carDetails = document.getElementById('carDetails').textContent;
    const location = document.querySelector('input[placeholder="Share Location"]').value;

    console.log('Collected form data:', {
        service1: service1Details,
        service2,
        service3,
        carDetails,
        location
    });

    if (!service1Details) {
        alert('Please select at least one service');
        return;
    }

    if (!carDetails) {
        alert('Please add car details');
        return;
    }

    const requestData = {
        details: `
            Service 1: ${service1Details}
            Service 2: ${service2}
            Service 3: ${service3}
            Car Details: ${carDetails}
            Location: ${location}
        `,
        status: 'Pending',
        createdAt: new Date()
    };

    console.log('Sending request data:', requestData);

    try {
        const response = await fetch(`${API_BASE_URL}/requests`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData)
        });

        const result = await response.json();
        console.log('Server response:', result);

        if (response.ok) {
            hideNewRequestModal();
            clearRequestForm();
            await loadRequests(); // Refresh the requests list
            alert('Request submitted successfully!');
        } else {
            throw new Error(result.message || 'Failed to submit request');
        }
    } catch (error) {
        console.error('Error submitting request:', error);
        alert('Failed to submit request. Please try again.');
    }
}
// Load and display requests
async function loadRequests() {
    const requestBox = document.querySelector('.request-box');
    
    try {
        const response = await fetch(`${API_BASE_URL}/requests`);
        const requests = await response.json();

        // Save the new request button
        const newRequestCard = document.querySelector('.newRequest-card');
        
        // Clear existing content
        requestBox.innerHTML = '';
        
        // Add back the new request button first
        requestBox.appendChild(newRequestCard);

        if (requests.length > 0) {
            requests.forEach(request => {
                const requestElement = createRequestElement(request);
                requestBox.insertBefore(requestElement, newRequestCard);
            });
        }
    } catch (error) {
        console.error('Error loading requests:', error);
    }
}

function createRequestElement(request) {
    const div = document.createElement('div');
    div.className = 'request-card';
    div.innerHTML = `
        <div class="request-header">
            <span>Request: <span class="status">${request.status}</span></span>
            <button class="toggle-btn" onclick="toggleDetails('${request._id}')">▼</button>
        </div>
        <div class="details" id="details-${request._id}" style="display: none;">
            ${request.details.split('\n').map(line => `<p>${line.trim()}</p>`).join('')}
            <p>Created: ${new Date(request.createdAt).toLocaleString()}</p>
        </div>
    `;
    return div;
}

function toggleDetails(requestId) {
    const detailsElement = document.getElementById(`details-${requestId}`);
    if (detailsElement) {
        const isHidden = detailsElement.style.display === 'none';
        detailsElement.style.display = isHidden ? 'block' : 'none';
    }
}

function clearRequestForm() {
    document.getElementById('service1Details').textContent = '';
    document.querySelector('input[placeholder="Service 2 (optional)"]').value = '';
    document.querySelector('input[placeholder="Service 3 (optional)"]').value = '';
    document.getElementById('carDetails').textContent = '';
    document.querySelector('input[placeholder="Share Location"]').value = '';
}

function confirmServiceSelection() {
    const selectedService = document.querySelector('input[name="serviceOption"]:checked');
    if (selectedService) {
        document.getElementById('service1Details').textContent = selectedService.value;
        document.getElementById('service1Details').style.display = 'block';
        hideServiceOffersModal();
    } else {
        alert('Please select a service option');
    }
}

function confirmCarDetailsSelection() {
    const carInputs = document.querySelectorAll('#carDetailsModal input[type="text"]');
    let carDetailsText = '';
    
    carInputs.forEach(input => {
        if (input.value) {
            carDetailsText += `${input.placeholder}: ${input.value}\n`;
        }
    });

    document.getElementById('carDetails').textContent = carDetailsText;
    document.getElementById('carDetails').style.display = 'block';
    hideCarDetailsModal();

    // Save car if checkbox is checked
    const saveCheckbox = document.getElementById('saveForLater');
    if (saveCheckbox.checked) {
        saveCar();
    }
}

// Function to show saved cars modal
function showSavedCarsModal() {
    // First create the modal if it doesn't exist
    let savedCarsModal = document.getElementById('savedCarsModal');
    if (!savedCarsModal) {
        savedCarsModal = document.createElement('div');
        savedCarsModal.id = 'savedCarsModal';
        savedCarsModal.className = 'modal';
        savedCarsModal.innerHTML = `
            <div class="modal-content">
                <h2>Select a Saved Car</h2>
                <div id="savedCarsList"></div>
                <div class="modal-buttons">
                    <button class="cancel-btn" onclick="hideSavedCarsModal()">Cancel</button>
                </div>
            </div>
        `;
        document.body.appendChild(savedCarsModal);
    }
    
    // Fetch and display saved cars
    fetchSavedCars();
    savedCarsModal.style.display = 'block';
}

// Function to hide saved cars modal
function hideSavedCarsModal() {
    const modal = document.getElementById('savedCarsModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Function to fetch saved cars with fixed selection
async function fetchSavedCars() {
    const savedCarsList = document.getElementById('savedCarsList');
    savedCarsList.innerHTML = 'Loading cars...';

    try {
        const response = await fetch(`${API_BASE_URL}/cars`);
        const cars = await response.json();

        if (cars.length === 0) {
            savedCarsList.innerHTML = 'No saved cars found.';
            return;
        }

        savedCarsList.innerHTML = cars.map(car => `
            <div class="saved-car-item" style="background-color: #352F2F; padding: 15px; border-radius: 8px; margin-bottom: 10px; color: #FFFFFF;">
                <p>Manufacturer: ${car.manufacturer}</p>
                <p>Model: ${car.vehicleModel}</p>
                <p>Year: ${car.modelYear}</p>
                <p>Color: ${car.vehicleColor}</p>
                <p>Plate: ${car.plateLetters} ${car.plateNumber}</p>
                <button onclick="selectSavedCar(${JSON.stringify({
                    manufacturer: car.manufacturer,
                    modelYear: car.modelYear,
                    vehicleModel: car.vehicleModel,
                    vehicleColor: car.vehicleColor,
                    plateLetters: car.plateLetters,
                    plateNumber: car.plateNumber
                }).replace(/"/g, '&quot;')})">
                    Select This Car
                </button>
            </div>
        `).join('');

    } catch (error) {
        console.error('Error fetching saved cars:', error);
        savedCarsList.innerHTML = 'Error loading saved cars.';
    }
}

// Updated function to select a saved car
function selectSavedCar(car) {
    try {
        console.log('Selected car:', car);
        const carDetails = `Manufacturer: ${car.manufacturer}
Model Year: ${car.modelYear}
Vehicle Model: ${car.vehicleModel}
Vehicle Color: ${car.vehicleColor}
Plate Letters: ${car.plateLetters}
Plate Number: ${car.plateNumber}`;

        document.getElementById('carDetails').textContent = carDetails;
        document.getElementById('carDetails').style.display = 'block';
        hideSavedCarsModal();
    } catch (error) {
        console.error('Error selecting car:', error);
        alert('Error selecting car. Please try again.');
    }
}
// Update the confirmSavedCar function to show the modal
function confirmSavedCar() {
    showSavedCarsModal();
}   
// Function to save car to database
async function saveCar() {
    // Get all car input values
    const manufacturer = document.querySelector('input[placeholder="Manufacturer"]').value;
    const modelYear = document.querySelector('input[placeholder="Model Year"]').value;
    const vehicleModel = document.querySelector('input[placeholder="Vehicle Model"]').value;
    const vehicleColor = document.querySelector('input[placeholder="Vehicle Color"]').value;
    const plateLetters = document.querySelector('input[placeholder="Plate Letters"]').value;
    const plateNumber = document.querySelector('input[placeholder="Plate Number"]').value;

    // Validate inputs
    if (!manufacturer || !modelYear || !vehicleModel || !vehicleColor || !plateLetters || !plateNumber) {
        alert('Please fill in all car details before saving');
        return;
    }

    const carData = {
        manufacturer,
        modelYear,
        vehicleModel,
        vehicleColor,
        plateLetters,
        plateNumber
    };

    try {
        const response = await fetch(`${API_BASE_URL}/cars`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(carData)
        });

        const result = await response.json();
        console.log('Car saving response:', result);

        if (response.ok) {
            alert('Car saved successfully!');
        } else {
            throw new Error(result.message || 'Failed to save car');
        }
    } catch (error) {
        console.error('Error saving car:', error);
        alert('Failed to save car. Please try again.');
    }
}

// Modify the confirmCarDetailsSelection function
function confirmCarDetailsSelection() {
    const carInputs = document.querySelectorAll('#carDetailsModal input[type="text"]');
    let carDetailsText = '';
    
    carInputs.forEach(input => {
        if (input.value) {
            carDetailsText += `${input.placeholder}: ${input.value}\n`;
        }
    });

    document.getElementById('carDetails').textContent = carDetailsText;
    document.getElementById('carDetails').style.display = 'block';

    // Check if "Save for later" is checked
    const saveCheckbox = document.getElementById('saveForLater');
    if (saveCheckbox && saveCheckbox.checked) {
        saveCar();
    }

    hideCarDetailsModal();
} 
// Update the createRequestElement function in script.js
function createRequestElement(request) {
    const div = document.createElement('div');
    div.className = 'request-card';
    div.id = request._id;

    const statusColors = {
        'Pending': '#FFA500',
        'In Progress': '#1E90FF',
        'Completed': '#32CD32'
    };

    div.innerHTML = `
        <div class="request-header">
            <span>Request: 
                <select class="status-select" onchange="updateStatus('${request._id}', this.value)" 
                        style="background-color: #352F2F; color: ${statusColors[request.status]}; border: none; padding: 5px; border-radius: 5px;">
                    <option value="Pending" ${request.status === 'Pending' ? 'selected' : ''}>Pending</option>
                    <option value="In Progress" ${request.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                    <option value="Completed" ${request.status === 'Completed' ? 'selected' : ''}>Completed</option>
                </select>
            </span>
            <div class="request-buttons" style="display: flex; gap: 5px;">
                <button class="toggle-btn" onclick="toggleDetails('${request._id}')">▼</button>
                  <button class="delete-btn" onclick="deleteRequest('${request._id}')" style="background-color: #ff4444; color: white; margin-left: 5px;">✕</button> 
                <button class="rate-btn" onclick="showRatingModal('${request._id}')"
                        style="background-color: #FBC767; border: none; border-radius: 5px; padding: 5px 10px; color: #352F2F; cursor: pointer; ${request.status !== 'Completed' ? 'display: none;' : ''}">
                    Rate
                </button>
            </div>
        </div>
        <div class="details" id="details-${request._id}" style="display: none;">
            ${request.details.split('\n').map(line => `<p>${line.trim()}</p>`).join('')}
            ${request.rating ? `
                <div class="rating-display">
                    <p>Rating: ${'★'.repeat(request.rating.value)}${'☆'.repeat(5-request.rating.value)}</p>
                    ${request.rating.review ? `<p>Review: ${request.rating.review}</p>` : ''}
                </div>
            ` : ''}
            <p>Created: ${new Date(request.createdAt).toLocaleString()}</p>
        </div>
    `;
    return div;
}

// Add the delete request function
// In your deleteRequest function, add logging:
async function deleteRequest(requestId) {
    if (!confirm('Are you sure you want to delete this request?')) {
        return;
    }

    try {
        console.log('Attempting to delete request:', requestId);
        const response = await fetch(`${API_BASE_URL}/requests/${requestId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log('Delete response:', response);

        if (response.ok) {
            await loadRequests();
            alert('Request deleted successfully');
        } else {
            const error = await response.json();
            console.error('Server error:', error);
            throw new Error(error.message || 'Failed to delete request');
        }
    } catch (error) {
        console.error('Error deleting request:', error);
        alert('Failed to delete request: ' + error.message);
    }
}
function getLocation() {
    const locationInput = document.querySelector('input[placeholder="Share Location"]');
    
    if (!navigator.geolocation) {
        locationInput.value = 'Geolocation not supported';
        return;
    }

    locationInput.value = 'Getting location...';
    
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            locationInput.value = `${latitude}, ${longitude}`;
        },
        (error) => {
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    locationInput.value = 'Location access denied';
                    break;
                case error.POSITION_UNAVAILABLE:
                    locationInput.value = 'Location unavailable';
                    break;
                case error.TIMEOUT:
                    locationInput.value = 'Location request timed out';
                    break;
                default:
                    locationInput.value = 'Location error';
            }
        }
    );
}
function showRatingModal(requestId) {
    ratingRequestId = requestId; // Store the request ID globally
    const modal = document.getElementById('ratingModal');
    modal.style.display = 'flex';
    
    // Reset stars and review
    currentRating = 0;
    updateStarDisplay(0);
    document.querySelector('#ratingModal textarea').value = '';
}

// Function to hide rating modal
function hideRatingModal() {
    const modal = document.getElementById('ratingModal');
    modal.style.display = 'none';
}

// Function to handle star hover
function handleStarHover(rating) {
    const stars = document.querySelectorAll('.rating-stars .star');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.textContent = '★';
            star.classList.add('star-hover');
        } else {
            star.textContent = '☆';
            star.classList.remove('star-hover');
        }
    });
}

// Function to update star display
function updateStarDisplay(rating) {
    const stars = document.querySelectorAll('.rating-stars .star');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.textContent = '★';
            star.classList.add('star-selected');
        } else {
            star.textContent = '☆';
            star.classList.remove('star-selected');
        }
    });
}

// Function to submit rating
async function submitRating() {
    try {
        const reviewText = document.querySelector('#ratingModal textarea').value;
        const response = await fetch(`${API_BASE_URL}/requests/${ratingRequestId}/rating`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                rating: currentRating,
                review: reviewText
            })
        });

        if (response.ok) {
            alert('Thank you for your rating!');
            hideRatingModal();
            await loadRequests(); // Refresh the requests list
        } else {
            throw new Error('Failed to submit rating');
        }
    } catch (error) {
        console.error('Error submitting rating:', error);
        alert('Failed to submit rating. Please try again.');
    }
}

// Function to update request status
async function updateStatus(requestId, newStatus) {
    try {
        const response = await fetch(`${API_BASE_URL}/requests/${requestId}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: newStatus })
        });

        if (response.ok) {
            const requestCard = document.getElementById(requestId);
            const rateButton = requestCard.querySelector('.rate-btn');
            
            // Show/hide rate button
            if (newStatus === 'Completed') {
                rateButton.style.display = 'block';
            } else {
                rateButton.style.display = 'none';
            }

            // Update status colors
            const statusColors = {
                'Pending': '#FFA500',
                'In Progress': '#1E90FF',
                'Completed': '#32CD32'
            };
            
            const statusSelect = requestCard.querySelector('.status-select');
            statusSelect.style.color = statusColors[newStatus];

            console.log('Status updated successfully');
        } else {
            throw new Error('Failed to update status');
        }
    } catch (error) {
        console.error('Error updating status:', error);
        alert('Failed to update status. Please try again.');
    }
}
function initializeRatingSystem() {
    const stars = document.querySelectorAll('.rating-stars .star');
    stars.forEach(star => {
        const rating = parseInt(star.dataset.rating);
        
        star.addEventListener('mouseover', () => handleStarHover(rating));
        star.addEventListener('mouseout', () => handleStarHover(currentRating));
        star.addEventListener('click', () => {
            currentRating = rating;
            updateStarDisplay(rating);
        });
    });

    document.getElementById('ratingCancelBtn').addEventListener('click', hideRatingModal);
    document.getElementById('ratingSubmitBtn').addEventListener('click', submitRating);
}
// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadRequests();
    initializeRatingSystem()
});