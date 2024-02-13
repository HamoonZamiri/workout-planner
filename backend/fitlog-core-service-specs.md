# FitLog Core Service

## Models

Workout - represents a singular exercise

| Field      | Type    | Description                            | Default            |
| ---------- | ------- | -------------------------------------- | ------------------ |
| id         | uuid    | Primary key                            | Not nullable       |
| title      | varchar | Title of the exercise                  | Not nullable       |
| repsLow    | integer | Lower bound of reps for this exercise  | 4                  |
| repsHigh   | integer | Upper bound of reps for this exercise  | 12                 |
| load       | number  | Weight used for this exercise          | Not nullable       |
| weightType | enum    | lbs" or “kg”                           | Units for the load |
| setsLow    | integer | Lower bound of sets for this exercise  | 1                  |
| setsHigh   | integer | Upper bound of sets for this exercise  | 3                  |
| routineId  | uuid    | The routine id this workout belongs to | Not nullable       |

Routine - represents a collection of workouts

| Field          | Type    | Description                                  | Default      |
| -------------- | ------- | -------------------------------------------- | ------------ |
| title          | varchar | Title of the routine                         | Not nullable |
| description    | varchar | Description of the routine                   | Not nullable |
| timeToComplete | integer | Time it takes to complete routine in minutes | 0            |
| userId         | uuid    | ID of user who created routine               | Not nullable |

---

## Endpoints

| Method | Resource                     | Description                                                              | Body                                                                                                                                | Returns                                            |
| ------ | ---------------------------- | ------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| POST   | /api/core/routine            | Creates a routine based on request body                                  | title, description, userId, timeToComplete                                                                                          | the created routine                                |
| GET    | /api/core/routine            | Gets all routines across all users                                       | None                                                                                                                                | the list of routines                               |
| GET    | /api/core/routine/mine       | Get all the current users routines (based on JWT token)                  | None                                                                                                                                | the list of routines belonging to the current user |
| DELETE | /api/core/routine/:routineId | Deletes the routine with id matching url param                           | None                                                                                                                                | Returns success message                            |
| PUT    | /api/core/routine/:routineId | Updates the routine with id matching the url param with the request body | optional[title], optional[description], optional[timeToComplete]                                                                    | Returns updated routine                            |
| GET    | /api/core/workout            | Gets all workouts across all users                                       | None                                                                                                                                | list of all workouts                               |
| POST   | /api/core/workout            | Creates a new workout tied to a routine                                  | title, optional[repsLow], optional[repsHigh], optional[setsLow], optional[setsHigh], routineId, load                                | Returns the created workout                        |
| GET    | /api/core/workout/mine       | Gets all workouts tied to current user                                   | None                                                                                                                                |                                                    |
| GET    | /api/core/workout/:id        | Gets workout with id equal to the url param                              | None                                                                                                                                |                                                    |
| DELETE | /api/core/workout/:id        | Deletes workout with id equal to the url param                           | None                                                                                                                                |                                                    |
| PUT    | /api/core/workout/:id        | Updates the workout with id matching url param                           | optional[title], optional[repsLow], optional[repsHigh], optional[setsLow], optional[setsHigh], optional[routineId], optional[load], |                                                    |

