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

// Confirm carDetails selection and display details
function confirmCarDetailsSelection() {
// Get the selected car detail option
const selectedOption = document.querySelector('input[name="carDetail"]:checked');

if (selectedOption) {
// Display the selected car detail in the corresponding section
const carDetails = document.getElementById("carDetails");
carDetails.innerHTML = `<p>${selectedOption.value}</p>`;
carDetails.style.display = "block"; // Show the car details section

// Hide the car details modal after selection
hideCarDetailsModal();
} else {
// Alert if no option is selected
alert("Please select a car detail option.");
}
}