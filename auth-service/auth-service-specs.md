# Auth Service

Responsible for authenticating user requests based on JWT tokens

## Models

auth_user - duplicated user just including core information needed for JWT token stuff. This id matches the id in the user detail service

| Field    | Type    | Description     | Default      |
| -------- | ------- | --------------- | ------------ |
| id       | uuid    | primary key     | Not nullable |
| email    | varchar | user email      | Not nullable |
| password | varchar | hashed password | Not nullable |

---

## Endpoints

| Method | Resource               | Description                                                     | Body            | Returns                     |
| ------ | ---------------------- | --------------------------------------------------------------- | --------------- | --------------------------- |
| POST   | /api/auth/login        | Logs the user in by validating their email and password         | email, password | JWT and refresh token       |
| POST   | /api/auth/refresh/:id  | Creates new access token and updates refresh token for user     | None            | Returns both tokens         |
| POST   | /api/auth/signup       | Creates a new user and logs them in automatically               | email, password | user, refresh and JWT token |
| POST   | /api/auth/authenticate | Checks JWT token in http header to ensure user is authenticated | None            | The users id                |

---

## Events

- Publishes user_created event when a user signs up
