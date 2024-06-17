
---

# Node User Management

Node User Management is a RESTful application built with Node.js and MySQL for user registration, sign-up, login, and token management. It includes Swagger documentation for easy API reference.

## Features

- **User Registration:** Super admin can register new users via API (`/auth/register`). A randomly generated password is sent to the user's email.
- **User Sign-up:** Users can sign up themselves via API (`/auth/sign-up`).
- **Login:** Users can log in to the system via API (`/auth/login`).
- **Token Management:** Refresh tokens are used for secure session management.
- **Swagger Documentation:** Explore and test APIs easily with Swagger UI.

## Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/seremwen/node-user-management.git
   cd node-user-management
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Database Setup**

   - Ensure MySQL is running.
   - Create a new database for the application.


4. **Start the server**

   Start the Node.js server:

   ```bash
   node index.js
   ```

   The server will start at `http://localhost:3000` (or another port as configured).

## API Documentation

Explore the API endpoints and test them using Swagger UI. Access Swagger UI at:

```
http://localhost:3000/api-docs
```

## Super Admin Access

- On system startup, a super admin is created automatically.
- Use the super admin credentials to access the `/auth/register` API for registering new users.

## Directory Structure


- **`/middlewares`:** Middleware functions.
- **`/models`:** Database models.
- **`/routes`:** Route definitions for different API endpoints.


## Contributing

Contributions are welcome! Fork the repository and submit a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
