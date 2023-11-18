# backend

### Prerequisites
- Node.js server running on `localhost` at port `5000`.
     - You can run it using `npm install` and `npm start` 

## API Endpoints

The following table lists the available endpoints in the API, along with their HTTP methods and a brief description.

### User Endpoints

| Method | Endpoint                   | Description                        | Access      |
|--------|----------------------------|------------------------------------|-------------|
| POST   | `/api/users`               | Register a new user.               | Public      |
| POST   | `/api/users/signin`        | Sign in an existing user.          | Public      |
| GET    | `/api/users`               | Retrieve all users.                | Admin Only  |
| GET    | `/api/users/:userId`       | Retrieve a specific user's details.| Authenticated Users |
| PUT    | `/api/users/:userId`       | Update a specific user's details.  | Admin or User |
| DELETE | `/api/users/:userId`       | Delete a specific user.            | Admin Only  |


Server listens on `localhost:5005` make sure you have placeholders like `YOUR_USER_ID` and `YOUR_TOKEN`.

1. **Create (Register a New User):**
   ```bash
   curl -X POST http://localhost:5005/api/users \
        -H 'Content-Type: application/json' \
        -d '{"username": "foobar", "password": "password123", "email": "foobar@example.com", "role": "user", "fullName": "Foo Bar", "phone": 1234567890, "address": "123 Foobar St"}'
   ```

 2. **Sign In (Get a Token):**
   ```bash
   curl -X POST http://localhost:5005/api/users/signin \
        -H 'Content-Type: application/json' \
        -d '{"username": "foobar", "password": "password123"}'
   ```
3. **Read (Get User Profile):**
   Replace `YOUR_USER_ID` with the actual user ID.
   ```bash
   curl -X GET http://localhost:5005/api/users/YOUR_USER_ID \
        -H 'Authorization: Bearer YOUR_TOKEN'
   ```

4. **Update (Update User Profile):**
   Replace `YOUR_USER_ID` with the actual user ID.
   ```bash
   curl -X PUT http://localhost:5005/api/users/YOUR_USER_ID \
        -H 'Content-Type: application/json' \
        -H 'Authorization: Bearer YOUR_TOKEN' \
        -d '{"fullName": "Foo Bar Updated", "address": "456 Foobar St"}'
   ```

5. **Delete (Delete User, Admin only!):**
   Replace `YOUR_USER_ID` with the actual user ID.
   ```bash
   curl -X DELETE http://localhost:5005/api/users/YOUR_USER_ID \
        -H 'Authorization: Bearer YOUR_TOKEN'
   ```


