# Vehicle Management System

A full-stack vehicle tracking application built with .NET Core and Angular. This project demonstrates secure authentication, role-based access control, and PostgreSQL integration.

## 🚀 Features
- **Authentication:** JWT-based login with HttpOnly Cookies and Refresh Tokens.
- **Role-Based Access:** Admin, Employee, and User roles.
- **Data Management:** CRUD operations for vehicles and users.
- **Reporting:** Distance tracking reports between specific dates.
- **Logging:** Centralized logging with Serilog and Graylog.
- **Frontend:** Angular with interceptors for automatic token management.

## 🛠️ Technologies
- **Backend:** .NET 8 Web API, Entity Framework Core
- **Frontend:** Angular 17+
- **Database:** PostgreSQL
- **Tools:** Graylog (Logging), Docker (Optional for Graylog)

## 🔐 Default Login Credentials
For ease of testing, the database script includes two pre-configured accounts:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@demo.com` | `password123` |
| **User** | `user@demo.com` | `password123` |

> **Note:** The Admin account has full access to delete vehicles and view user data.

## ⚙️ Setup Instructions

### 1. Database Setup
1. Ensure you have **PostgreSQL** installed.
2. Create a new database named `vehicle`.
3. Navigate to the `database` folder in this repository.
4. Restore the `init_vehicles.sql` file to your database (using pgAdmin or `psql`) to populate the initial tables.
5. (Optional) Run `init_users.sql` to add the demo accounts.

### 2. Backend Setup
1. Open a terminal and navigate to the `backend` folder:
   ```bash
   cd backend
