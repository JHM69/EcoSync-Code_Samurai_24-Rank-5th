 
# EcoSync: Comprehensive Waste Management System

![EcoSync Banner](https://raw.githubusercontent.com/JHM69/EcoSync-Code_Samurai_24-Rank-5th/main/images/Slide2.PNG)

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Installation](#installation)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
- [Deployment](#deployment) 
- [Contact](#contact)

## Overview

EcoSync is a robust waste management system developed for the Dhaka North City Corporation (DNCC). It optimizes waste collection, transportation, and processing through advanced technological solutions. As part of the Code Samurai 2024 competition, EcoSync integrates a scalable Express.js backend with a responsive React frontend, offering a full-stack solution tailored for urban waste management logistics.
![EcoSync Banner](https://raw.githubusercontent.com/JHM69/EcoSync-Code_Samurai_24-Rank-5th/main/images/Slide8.PNG)

## Features

- **User Management**
  - Create, update, and delete user accounts
  - Assign roles and manage permissions
![EcoSync Banner](https://raw.githubusercontent.com/JHM69/EcoSync-Code_Samurai_24-Rank-5th/main/images/Slide11.PNG)
- **Vehicle and STS Management**
  - Add and monitor vehicles
  - Manage Secondary Transfer Stations (STS) for efficient waste handling
![EcoSync Banner](https://raw.githubusercontent.com/JHM69/EcoSync-Code_Samurai_24-Rank-5th/main/images/Slide12.PNG)
![EcoSync Banner](https://raw.githubusercontent.com/JHM69/EcoSync-Code_Samurai_24-Rank-5th/main/images/Slide13.PNG)
![EcoSync Banner](https://raw.githubusercontent.com/JHM69/EcoSync-Code_Samurai_24-Rank-5th/main/images/Slide14.PNG)
![EcoSync Banner](https://raw.githubusercontent.com/JHM69/EcoSync-Code_Samurai_24-Rank-5th/main/images/Slide15.PNG)

- **Role-Based Access Control (RBAC)**
  - Secure access to application modules based on user roles
- **Authentication and Authorization**
  - JWT-based secure authentication
  - Role-based authorization for API endpoints
- **Real-Time Dashboard**
  - Interactive maps displaying waste levels, truck locations, and landfill statuses
  - Date-based controls for historical data analysis
- **Optimized Routing Algorithms**
  - Dynamic route planning for waste collection trucks
  - Reinforcement learning integration for enhanced efficiency
![EcoSync Banner](https://raw.githubusercontent.com/JHM69/EcoSync-Code_Samurai_24-Rank-5th/main/images/Slide8.PNG)
- **Notification System**
  - Real-time notifications for truck drivers regarding assignments and routes
- **Environmental Impact Monitoring**
  - Track and report on waste management efficiency and environmental benefits

## Technology Stack
![EcoSync Banner](https://raw.githubusercontent.com/JHM69/EcoSync-Code_Samurai_24-Rank-5th/main/images/Slide5.PNG)
- **Backend**
  - **Node.js**: JavaScript runtime
  - **Express.js**: Web framework
  - **Prisma ORM**: Database ORM
  - **PostgreSQL**: Relational database
  - **JWT**: Authentication
  - **Nodemailer**: Email services
- **Frontend**
  - **React.js**: User interface library
  - **Next.js**: Server-side rendering
  - **GeoJSON & ArcGIS**: Geospatial data handling
- **DevOps**
  - **Docker** & **Docker Compose**: Containerization
  - **CI/CD Pipelines**: Automated testing and deployment
- **Other Tools**
  - **Figma**: UI/UX design
  - **Git**: Version control
  
## Mobile App
We have also developed a android app to connect all the people of City Corporation to Create Issues, Get Status updates on submitted issues, DNCC authorities has special access to update issues and many more.
![EcoSync Banner](https://raw.githubusercontent.com/JHM69/EcoSync-Code_Samurai_24-Rank-5th/main/images/Slide17.PNG)
![EcoSync Banner](https://raw.githubusercontent.com/JHM69/EcoSync-Code_Samurai_24-Rank-5th/main/images/Slide18.PNG)
![EcoSync Banner](https://raw.githubusercontent.com/JHM69/EcoSync-Code_Samurai_24-Rank-5th/main/images/Slide19.PNG)


## Architecture

EcoSync follows a modular architecture, separating concerns between the frontend, backend, and database layers. The system leverages RESTful APIs for communication between the frontend and backend, ensuring scalability and maintainability.

![EcoSync Banner](https://raw.githubusercontent.com/JHM69/EcoSync-Code_Samurai_24-Rank-5th/main/images/Slide6.PNG)

## Installation

### Prerequisites

- **Docker**: Ensure Docker is installed on your machine.
- **Docker Compose**: Required for orchestrating multi-container Docker applications.

### Steps

1. **Clone the Repository**

   ```bash
   git clone https://github.com/jhm69/CS24-p2-quantum_guys.git
   ```

2. **Navigate to the Project Directory**

   ```bash
   cd CS24-p2-quantum_guys
   ```

3. **Set Up Environment Variables**

   Create a `.env` file based on the provided `.env.example`.

   ```bash
   cp .env.example .env
   ```

   Update the `.env` file with your specific configurations.

4. **Build and Start Services with Docker Compose**

   ```bash
   docker-compose up --build
   ```

   - **Backend**: Runs on `http://localhost:5000`
   - **Frontend**: Runs on `http://localhost:3000`

5. **Clean Up Unused Docker Resources**

   To remove all unused images and volumes:

   ```bash
   docker system prune -a --volumes -f
   ```

## Configuration

### Environment Variables

Configure the application through environment variables specified in the `.env` file.

- `JWT_SECRET`: Secret key for JWT authentication.
- `DATABASE_URL`: PostgreSQL connection string.
- `NODEMAILER_HOST`: SMTP host for Nodemailer.
- `NODEMAILER_PORT`: SMTP port.
- `NODEMAILER_USER`: SMTP user.
- `NODEMAILER_PASS`: SMTP password.

### Sample User Credentials

For initial setup, you can create sample users with the following credentials:

```bash
# System Admin
TYPE="System Admin"
EMAIL="admin@admin.com"
PASSWORD="1234"

# STS Manager
TYPE="STS Manager"
EMAIL="jahangirhmarup@gmail.com"
PASSWORD="121212"

# Landfill Manager
TYPE="Landfill Manager"
EMAIL="b190305009@cse.jnu.ac.bd"
PASSWORD="12345678"
```

## API Documentation

The backend API offers endpoints for:

- **User Management**
  - `POST /api/users`: Create a new user
  - `GET /api/users`: Retrieve all users
  - `PUT /api/users/:id`: Update user details
  - `DELETE /api/users/:id`: Delete a user
- **Vehicle Management**
  - `POST /api/vehicles`: Add a new vehicle
  - `GET /api/vehicles`: Retrieve all vehicles
  - `PUT /api/vehicles/:id`: Update vehicle details
  - `DELETE /api/vehicles/:id`: Remove a vehicle
- **STS Management**
  - `POST /api/sts`: Add a new STS
  - `GET /api/sts`: Retrieve all STS
  - `PUT /api/sts/:id`: Update STS details
  - `DELETE /api/sts/:id`: Remove an STS
- **Authentication**
  - `POST /api/auth/login`: User login
  - `POST /api/auth/register`: User registration
- **Waste Collection**
  - `GET /api/waste/status`: Get waste status
  - `POST /api/waste/collect`: Record waste collection

For detailed API specifications, refer to the [API Documentation](link_to_api_docs).

## Deployment

EcoSync can be deployed using Docker containers. For production deployment:

1. **Build Docker Images**

   ```bash
   docker-compose build
   ```

2. **Run Containers in Detached Mode**

   ```bash
   docker-compose up -d
   ```
 
## Contact

For inquiries or support, please contact:

- **Jahangir Hossain**
  - [GitHub](https://github.com/JHM69)

- **Farhan Masud Shohag**
  - [GitHub](https://github.com/fmsbyte)

- **MT Asfi**
  - [GitHub](https://github.com/asfi50)

---

## Acknowledgements

- **Code Samurai 2024 Organizers**
- **Dhaka North City Corporation (DNCC)**
- **Open-Source Community Contributors**

 
 
