Environment Variables
Create a .env file in the backend root by copying .env.example and filling in the actual credentials.

Backend API Documentation
Authentication & User Routes (/api/users)
POST /register
Registers a new user.
Request Body: { name, email, password }
Response: Newly created user ID or error.

POST /login
Logs in a user and returns an authentication token.
Request Body: { email, password }
Response: JWT token for authentication.

GET /me
Gets the profile of the currently authenticated user.
Headers: Authorization: Bearer <token>
Response: User info (id, name, email).

Notes Routes (/api/notes)
All routes below require authentication (send JWT token in Authorization header).

POST /
Create a new note.
Request Body: { title, content }
Response: Created note ID.

GET /
Get all notes of the authenticated user, with optional filtering, sorting, and pagination.
Query Parameters:

categoryId (array of category IDs to filter by)

limit (number of notes to return)

offset (pagination offset)

sortBy (field to sort by, e.g., created_at)

order (ASC or DESC)

search (search text in title or content)
Response: List of notes.

GET /:id
Get a specific note by ID (only if owned by user).
Response: Note object.

PUT /:id
Update a specific note by ID.
Request Body: { title, content }
Response: Number of affected rows.

DELETE /:id
Delete a specific note by ID.
Response: Number of affected rows.

Categories Routes (/api/categories)
All routes below require authentication.

GET /notes/:id/categories
Get all categories linked to a specific note.
Response: Array of categories.

GET /
Get all categories visible to the user (including predefined categories).
Response: Array of categories.

DELETE /:id
Delete a specific user-created category by ID.
Response: Status (success/failure).

DELETE /
Delete all user-created categories belonging to the authenticated user.
Response: Status.

Authentication Middleware
Protects all /notes and /categories routes to ensure only authenticated users can access.