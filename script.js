// Toggle request details
document.querySelectorAll('.toggle-btn').forEach(button => {
    button.addEventListener('click', () => {
        const details = button.parentElement.nextElementSibling;
        const isVisible = !details.hidden;
        details.hidden = isVisible;
        button.setAttribute('aria-expanded', !isVisible);
    });
});

// Open and close the New Request Modal
const newRequestModal = document.getElementById('newRequestModal');
const openModalButton = document.getElementById('openNewRequestModal');
const closeModalButton = document.getElementById('cancelRequest');

openModalButton.addEventListener('click', () => {
    newRequestModal.style.display = 'flex';
    newRequestModal.setAttribute('aria-hidden', 'false');
});

closeModalButton.addEventListener('click', () => {
    newRequestModal.style.display = 'none';
    newRequestModal.setAttribute('aria-hidden', 'true');
});

// Close modal if clicked outside of content area
window.addEventListener('click', (event) => {
    if (event.target === newRequestModal) {
        newRequestModal.style.display = 'none';
        newRequestModal.setAttribute('aria-hidden', 'true');
    }
});


// Toggle details for request cards
function toggleDetails(cardId) {
    var card = document.getElementById(cardId);
    var details = card.querySelector('.details');
    var toggleBtn = card.querySelector('.toggle-btn');
    
    if (details.style.display === 'none') {
        details.style.display = 'block';
        toggleBtn.textContent = '▲';
    } else {
        details.style.display = 'none';
        toggleBtn.textContent = '▼';
    }
}

// Show and hide the New Request modal
function showNewRequestModal() {
    document.getElementById("newRequestModal").style.display = "flex";
}

function hideNewRequestModal() {
    document.getElementById("newRequestModal").style.display = "none";
}

// Show and hide the Service Offers modal
function showServiceOffersModal() {
    document.getElementById("serviceOffersModal").style.display = "flex";
}

function hideServiceOffersModal() {
    document.getElementById("serviceOffersModal").style.display = "none";
}

// Show and hide the Car Details Offers modal
function showCarDetailsModal() {
    document.getElementById("carDetailsModal").style.display = "flex";
}

function hideCarDetailsModal() {
    document.getElementById("carDetailsModal").style.display = "none";
}

// Confirm service selection and display details in Service 1 card
function confirmServiceSelection() {
    const selectedOption = document.querySelector('input[name="serviceOption"]:checked');
    if (selectedOption) {
        // Display the selected service details in Service 1 card
        const service1Details = document.getElementById("service1Details");
        service1Details.innerHTML = `<p>${selectedOption.value}</p>`;
        service1Details.style.display = "block";
        
        hideServiceOffersModal();
    } else {
        alert("Please select a service option.");
    }
}

// Function to confirm car details selection and display it
function confirmCarDetailsSelection() {
    // Get the values from the input fields
    const manufacturer = document.querySelector('input[placeholder="Manufacturer"]').value;
    const modelYear = document.querySelector('input[placeholder="Model Year"]').value;
    const vehicleModel = document.querySelector('input[placeholder="Vehicle Model"]').value;
    const vehicleColor = document.querySelector('input[placeholder="Vehicle Color"]').value;
    const plateLetters = document.querySelector('input[placeholder="Plate Letters"]').value;
    const plateNumber = document.querySelector('input[placeholder="Plate Number"]').value;
    
    // Check if all fields have values
    if (manufacturer && modelYear && vehicleModel && vehicleColor && plateLetters && plateNumber) {
        // Display the selected car details in the appropriate section
        const carDetails = document.getElementById("carDetails");
        carDetails.innerHTML = `
            <p><strong>Manufacturer:</strong> ${manufacturer}</p>
            <p><strong>Model Year:</strong> ${modelYear}</p>
            <p><strong>Vehicle Model:</strong> ${vehicleModel}</p>
            <p><strong>Vehicle Color:</strong> ${vehicleColor}</p>
            <p><strong>Plate Letters:</strong> ${plateLetters}</p>
            <p><strong>Plate Number:</strong> ${plateNumber}</p>
        `;
        carDetails.style.display = "block";  // Show the car details section
        
        // Hide the modal after selection
        hideCarDetailsModal();
    } else {
        // Alert if any field is missing
        alert("Please fill in all the car details.");
    }
}


//Add the new request into request box in home page
function addNewRequest() {
    // Get the request box and the new request card
    const requestBox = document.querySelector('.request-box');
    const newRequestCard = document.querySelector('.newRequest-card');

    // Create a new request card element
    const newCard = document.createElement('div');
    newCard.className = 'request-card';
    newCard.innerHTML = `
        <div class="request-header">
            <span>Request: <span class="status">Pending</span></span>
            <button class="toggle-btn" onclick="toggleDetails('newRequestCard')">▼</button>
        </div>
        <div class="details" style="display: none;">
            <p>Service details will be updated dynamically</p>
        </div>
    `;

    // Insert the new card before the new request card
    requestBox.insertBefore(newCard, newRequestCard);

    // Hide the New Request Modal
    hideNewRequestModal();
}