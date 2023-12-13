# Backend for Consumer-App

## Introduction

This backend serves as the core API for the Consumer-App,Driver-app and Locker-simulator handling all operations related to parcel delivery services. It facilitates user registration, authentication, parcel tracking, and management.

Live Backend: [Backend on Azure](https://node-backend-speed.azurewebsites.net)

## Prerequisites

- Node.js (See [Node.js official site](https://nodejs.org/en/) for installation)
- Postman or similar API testing tool for making requests

## Running the Server Locally

1. **Install Dependencies**:
   ```bash
   npm install
   ```
2. **Start the Server in Development Mode**:
   ```bash
   npm run dev
   ```
   The server will start, typically on `localhost:5000`.

## API Endpoints

Key endpoints available in the API include user registration, authentication, and parcel management.

### Some User Endpoints

| Method | Endpoint            | Description                    |
| ------ | ------------------- | ------------------------------ |
| POST   | `/api/users`        | Register a new user.           |
| POST   | `/api/users/signin` | Authenticate an existing user. |

### Sample Requests

1. **Create (Register a New User)**:

   ```bash
   curl -X POST https://node-backend-speed.azurewebsites.net/api/users \
        -H 'Content-Type: application/json' \
        -d '{"username": "newuser", "password": "password", "email": "newuser@example.com"}'
   ```

2. **Sign In (Authenticate User)**:
   ```bash
   curl -X POST https://node-backend-speed.azurewebsites.net/api/users/signin \
        -H 'Content-Type: application/json' \
        -d '{"username": "newuser", "password": "password"}'
   ```

## Deployment

The backend is deployed on Azure and updated through a CI/CD pipeline connected to the [GitHub repository](https://github.com/Speed-Delivery/backend.git).

## Built With

- [Node.js](https://nodejs.org/) and [Express](https://expressjs.com/) - Server framework
- [Azure App Service](https://azure.microsoft.com/en-us/services/app-service/) - Hosting platform

## Authors

- **Mussa Muna**
- **Nafisa Akter**
- **Gebrehiwot Matusala**
- **Mst Airen Aktar**

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
