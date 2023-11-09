# backend

### Prerequisites
- Node.js server running on `localhost` at port `5000`.
     - You can run it using `npm install` and `npm start` 

#### User Signup task description

## C1 User signup 

The application must enable the signup of a user. A user is created by entering a username and password, which enables logging into the application.
To create a new user with the signup endpoint, you would send a POST request with the necessary data.

```sh
curl -X POST http://localhost:5000/api/user/signup \
-H "Content-Type: application/json" \
-d '{
    "username": "user1", 
    "password": "password123"
}'
```
If you send it for second time it will raise an error.

