// Base API URL
const API_BASE_URL = "http://localhost:3000/api";

// Function to fetch user information by userID
async function fetchUserById(userID) {
    try {
        const response = await fetch(`${API_BASE_URL}/users/${userID}`);
        if (!response.ok) {
            throw new Error(`User not found (Status: ${response.status})`);
        }
        const user = await response.json();
        console.log("User Info:", user);
        displayUserInfo(user);
    } catch (error) {
        console.error("Error fetching user info:", error.message);
        alert("Error fetching user information. Please check the user ID.");
    }
}

// Function to display user information in the UI
function displayUserInfo(user) {
    const userInfoDiv = document.getElementById("user-info");
    userInfoDiv.innerHTML = `
        <h3>User Details</h3>
        <p><strong>Name:</strong> ${user.name}</p>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Phone:</strong> ${user.phone}</p>
        <h4>Car Details:</h4>
        <ul>
            ${user.carDetails
                .map(
                    (car) =>
                        `<li>${car.manufacturer} ${car.vehicleModel} (${car.modelYear}) - ${car.vehicleColor} [${car.plateLetters}-${car.plateNumber}]</li>`
                )
                .join("")}
        </ul>
    `;
}

// Function to add a new car
async function addNewCar(carData) {
    try {
        const response = await fetch(`${API_BASE_URL}/cars`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(carData),
        });
        const result = await response.json();
        if (response.ok) {
            alert("Car added successfully!");
            console.log("Car:", result.car);
        } else {
            throw new Error(result.message);
        }
    } catch (error) {
        console.error("Error adding car:", error.message);
        alert("Error adding car. Please try again.");
    }
}

// Function to create a new service request
async function createServiceRequest(requestData) {
    try {
        const response = await fetch(`${API_BASE_URL}/requests`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestData),
        });
        const result = await response.json();
        if (response.ok) {
            alert("Service request created successfully!");
            console.log("Request:", result.request);
        } else {
            throw new Error(result.message);
        }
    } catch (error) {
        console.error("Error creating service request:", error.message);
        alert("Error creating service request. Please try again.");
    }
}

// Event Listener for Fetch User by ID
document.getElementById("fetch-user-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const userID = document.getElementById("user-id").value;
    fetchUserById(userID);
});

// Event Listener for Adding New Car
document.getElementById("add-car-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const carData = {
        manufacturer: document.getElementById("car-manufacturer").value,
        modelYear: document.getElementById("car-model-year").value,
        vehicleModel: document.getElementById("car-model").value,
        vehicleColor: document.getElementById("car-color").value,
        plateLetters: document.getElementById("car-plate-letters").value,
        plateNumber: document.getElementById("car-plate-number").value,
    };
    addNewCar(carData);
});

// Event Listener for Creating a Service Request
document.getElementById("create-request-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const requestData = {
        details: document.getElementById("request-details").value,
    };
    createServiceRequest(requestData);
});
