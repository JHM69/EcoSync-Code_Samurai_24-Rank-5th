
# EcoSync: Code Samurai 2024 

Know our story https://www.linkedin.com/pulse/experience-code-samurai-2024-jahangir-hossain-zgglc/

EcoSync is a comprehensive waste management system designed for the Dhaka North City Corporation (DNCC), focusing on optimizing waste collection, transportation, and processing through technological innovation. This project includes an Express.js backend server and a React frontend application, providing a full-stack solution for managing the complex logistics of urban waste management as a part of the Code Samurai 2024 competition.

## Features

- **User Management**: System administrators can create users, assign roles, and manage permissions.
- **Vehicle and STS Management**: Admins can add and manage vehicles and Secondary Transfer Stations (STS) for efficient waste collection and transportation.
- **Role-Based Access Control (RBAC)**: Securely manage access to different parts of the application based on user roles.
- **Authentication and Authorization**: Secure user authentication and role-based authorization for API access.
- **Environmentally Focused**: Designed to improve the efficiency of waste management processes, contributing to a healthier urban environment.

## Technology Stack

- **Backend**: Node.js with Express.js
- **Frontend**: Next js/React
- **Database**: PostgreSQL
- **Authentication**: JWT for secure authentication
- **Email Service**: Nodemailer for email-based functionalities (e.g., password reset)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Docker
- Docker Compose

### Installation

1. Clone the repository to your local machine.
   
   ```
   git clone https://github.com/jhm69/CS24-p2-quantum_guys.git
   ```

2. Navigate to the project directory.

   ```
   cd CS24-p2-quantum_guys
   ```

3. Use Docker Compose to build and start the services.

   ```
   docker-compose up --build
   ```

This command will start the Express.js backend server on port 5000 and the React frontend application on port 3000. 

``` docker system prune -a --volumes -f ``` to remove all the unused images and volumes.
## Configuration

Example Authentication Configuration
```bash
TYPE = "System Admin"
EMAIL = "admin@admin.com"
PASSWORD = "1234"
```

```bash
TYPE = "STS Manager"
EMAIL = "jahangirhmarup@gmail.com"
PASSWORD = "121212"
```

```bash
TYPE = "Landfill Manager"
EMAIL = "b190305009@cse.jnu.ac.bd"
PASSWORD = "12345678"
```

The application is configured through environment variables specified in the `docker-compose.yaml` file. Key configurations include:

- `JWT_SECRET`: Secret key for JWT authentication.
- `DATABASE_URL`: Connection string for the PostgreSQL database.
- `NODEMAILER_CONFIG`: Configuration for Nodemailer to enable email sending functionalities.

## API

The backend API provides endpoints for user management, vehicle and STS management, and authentication. Refer to the API documentation for detailed endpoint information.
 
## Participants

- **Jahangir Hossain** - *4th Year CSE, JnU, Student* - [JHM69](https://github.com/JHM69)
- **Farhan Masud Shohag** - *4th Year CSE, JnU Student* - [fmsbyte](https://github.com/fmsbyte)
- **MT Asfi** - *4th Year CSE Student* - [asfi50](https://github.com/asfi50)
   
