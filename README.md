# Vehicle Management System

A full-stack vehicle tracking application built with .NET Core and Angular. This project demonstrates secure authentication, role-based access control, and PostgreSQL integration.

## Features
- **Authentication:** JWT-based login with HttpOnly Cookies and Refresh Tokens.
- **Role-Based Access:** Admin, Employee, and User roles.
- **Data Management:** CRUD operations for vehicles and users.
- **Reporting:** Distance tracking reports between specific dates.
- **Logging:** Centralized logging with Serilog and Graylog.
- **Frontend:** Angular with interceptors for automatic token management.

## Technologies
- **Backend:** .NET 8 Web API, Entity Framework Core
- **Frontend:** Angular 17+
- **Database:** PostgreSQL
- **Tools:** Graylog (Logging)

## Default Login Credentials
For ease of testing, the database script includes two pre-configured accounts:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@demo.com` | `password123` |
| **User** | `user@demo.com` | `password123` |

> **Note:** The Admin account has full access to delete vehicles and user data.

## Setup Instructions

### 1. Database Setup
1. Ensure you have **PostgreSQL** installed.
2. Create a new database named `vehicle`.
3. Navigate to the `database` folder in this repository.
4. Run the following scripts in order (using pgAdmin or `psql`) to create the tables and seed data:
   - First, run `init_vehicles.sql` (Creates vehicle table and data).
   - Second, run `init_users.sql` (Creates users table and demo accounts).

### 2. Backend Setup
1. Open a terminal and navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Open `appsettings.json`.
3. Update the `ConnectionStrings` and `Jwt` settings with your local values.
   *(Note: For security, real passwords are not committed. You must enter your own local database credentials.)*
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Host=localhost; Port=5432; Database=vehicle; Username=postgres; Password=YOUR_LOCAL_DB_PASSWORD"
     },
     "Jwt": {
       "Key": "REPLACE_THIS_WITH_A_LONG_SECRET_STRING_FOR_TESTING"
     }
   }
   ```
4. Run the API:
   ```bash
   dotnet run
   ```

### 3. Frontend Setup
1. Open a new terminal and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the application:
   ```bash
   ng serve
   ```
4. Open your browser to `http://localhost:4200`.

## 🧪 Running Tests
This project includes unit tests for the vehicle controllers.
1. Navigate to the tests folder:
   ```bash
   cd tests
   ```
2. Run the test suite:
   ```bash
   dotnet test
   ```
