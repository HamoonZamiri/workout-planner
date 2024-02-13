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

| Method | Resource            | Description                                                                  | Body            | Returns              |
| ------ | ------------------- | ---------------------------------------------------------------------------- | --------------- | -------------------- |
| POST   | /api/login          | Logs the user in by validating their email and password                      | email, password | JWT token            |
| POST   | /api/match/:user_id | Ensures the user represented by the auth token matches the url param user_id | None            | True if user matches |
| POST   | /api/signup         | Creates a new user and logs them in automatically                            | email, password | JWT token            |

---

## Events

- Publishes user_created event when a user signs up

