The website is designed to assist people who experience car breakdowns on the road by connecting them with assistance providers.

Access and Registration
To access the homepage, users must log in.
There are three types of accounts:
Assistance Provider – For those offering car assistance services.
Regular User – For individuals seeking assistance.
Admin – For managing and overseeing the platform.
Features for Regular Users
Request Management:

Create new assistance requests.
Preview existing requests and track their status (e.g., completed or pending).
Car Management:

Save car information for future requests.
Add or delete cars via the car.html page.
Simplify the process by selecting the "Save Car" option to store car details permanently, avoiding the need to re-enter information.


ServiceProviderHome.HTML: Displays service requests for providers.
Header: Contains a logout button linking to the login page.
Request Cards: Each card represents a service request with collapsible details.
JavaScript: Handles toggling details and updating request statuses.
Footer Navigation: Links to search and user information pages.


ServiceProviderInfo.HTML: Shows the provider's personal and vehicle information.
Info Sections: Personal details, car information, and highlights.
Footer Navigation: Links to home and search pages.


ServiceProviderSearch.HTML: Allows providers to view and accept new service requests.
Search Results: Displays pending requests with expandable details.
JavaScript: Handles toggling details and accepting requests.
Footer Navigation: Links to home and user information pages.

The AdminView.html code implements a responsive, single-page web application (SPA) to manage and analyze assistance service providers. Here's what it does:
User Interface Navigation:
Provides a dashboard with multiple sections (analytics, statistics, user list, provider registration, and user details) that are toggled dynamically without reloading the page.
Users can switch between pages using footer icons.

Analytics Page:
Displays general analytics, such as the number of requests, average response time, and feedback score.

Statistics Page:
Shows current statistics, including active users and new requests.
Includes a logout button redirecting to a login page.

User List and Details:
Displays a list of applicants with the ability to view detailed profiles of each.
Profiles contain personal and vehicle details, along with actions to accept or reject applications.

Assistance Provider Registration:
Allows adding a new provider via a multi-step form to input personal, vehicle, and service details.
Includes confirmation functionality upon form completion.

Interactivity:
Alerts users with confirmation messages when they accept, reject, or register a new employee.
Dynamic content display ensures seamless navigation between sections.

Styling:
Utilizes a dark theme with gold and white accents.
Features consistent, user-friendly design with flexible input fields, buttons, and responsive containers.