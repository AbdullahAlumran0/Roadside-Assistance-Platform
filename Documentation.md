### **Roadside Assistance Platform**

---

### **Introduction**
The Roadside Assistance Platform is designed to assist individuals experiencing car breakdowns by seamlessly connecting them with service providers. This platform ensures efficiency, reliability, and user-friendliness through robust back-end services and intuitive front-end design. Users can register as Assistance Providers, Regular Users, or Admins to access customized features tailored to their needs. 

---

### **Routes and Endpoints**

#### **User Authentication**
- **POST /login**
  - **Description**: Authenticates the user and grants access to the homepage.
- **POST /register**
  - **Description**: Registers a new user (Assistance Provider, Regular User, or Admin).

#### **Assistance Requests**
- **GET /requests**
  - **Description**: Retrieves all assistance requests for the logged-in user.
- **POST /requests**
  - **Description**: Creates a new assistance request.
- **PATCH /requests/:id**
  - **Description**: Updates the status of a specific assistance request (e.g., completed or pending).

#### **Car Management**
- **GET /cars**
  - **Description**: Retrieves all saved car information for the logged-in user.
- **POST /cars**
  - **Description**: Adds a new car to the user's account.
- **DELETE /cars/:id**
  - **Description**: Deletes a specific car from the user's account.

#### **Service Providers**
- **GET /service-requests**
  - **Description**: Retrieves all pending service requests for assistance providers.
- **POST /service-requests/:id/accept**
  - **Description**: Allows a service provider to accept a specific service request.
- **GET /service-providers/:id**
  - **Description**: Retrieves the profile of a specific service provider, including personal and vehicle details.

#### **Admin Management**
- **GET /admin/analytics**
  - **Description**: Provides general analytics about the platform (e.g., number of requests, response time).
- **GET /admin/statistics**
  - **Description**: Retrieves statistics on active users and new requests.
- **GET /admin/users**
  - **Description**: Retrieves a list of all users.
- **PATCH /admin/users/:id**
  - **Description**: Updates user details or application statuses.
- **POST /admin/providers**
  - **Description**: Registers a new assistance provider.

---

### **HTML File Descriptions**

#### **ServiceProviderHome.html**
- **Purpose**: Displays service requests for assistance providers.
- **Header**: Contains a logout button linking to the login page.
- **Request Cards**: Each card represents a service request with collapsible details.
- **JavaScript**: Handles toggling details and updating request statuses.
- **Footer Navigation**: Links to search and user information pages.

#### **ServiceProviderInfo.html**
- **Purpose**: Shows the provider's personal and vehicle information.
- **Info Sections**: Includes personal details, car information, and highlights.
- **Footer Navigation**: Links to home and search pages.

#### **ServiceProviderSearch.html**
- **Purpose**: Allows providers to view and accept new service requests.
- **Search Results**: Displays pending requests with expandable details.
- **JavaScript**: Handles toggling details and accepting requests.
- **Footer Navigation**: Links to home and user information pages.

#### **AdminView.html**
- **Purpose**: Implements a responsive single-page application (SPA) for managing and analyzing assistance service providers.
- **User Interface Navigation**: Provides a dashboard with multiple sections (analytics, statistics, user list, provider registration, and user details) toggled dynamically without reloading the page.
- **Analytics Page**: Displays general analytics, such as the number of requests, average response time, and feedback score.
- **Statistics Page**: Shows current statistics, including active users and new requests. Includes a logout button redirecting to a login page.
- **User List and Details**: Displays a list of applicants with the ability to view detailed profiles. Profiles include personal and vehicle details, with options to accept or reject applications.
- **Assistance Provider Registration**: Allows adding a new provider via a multi-step form to input personal, vehicle, and service details. Includes confirmation functionality upon form completion.
- **Interactivity**: Alerts users with confirmation messages when accepting, rejecting, or registering a new provider. Dynamic content display ensures seamless navigation between sections.
- **Styling**: Utilizes a dark theme with gold and white accents. Features consistent, user-friendly design with flexible input fields, buttons, and responsive containers.

---

### **Conclusion**
The Roadside Assistance Platform effectively bridges the gap between individuals in need of roadside help and assistance providers. With its comprehensive features, from user authentication to service management, the platform ensures a smooth and efficient experience for all stakeholders. By combining intuitive front-end designs and a robust back-end infrastructure, this platform is a reliable solution for handling roadside emergencies.