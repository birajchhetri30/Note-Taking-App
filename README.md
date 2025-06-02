<h1>Backend API Documentation</h1>

<h3>Authentication & User Routes (<code>/api/users</code>)</h3>

<ul>
  <li>
    <strong>POST <code>/register</code></strong><br />
    Registers a new user.<br />
    <strong>Request Body:</strong> &#123; name, email, password &#125;<br />
    <strong>Response:</strong> Newly created user ID or error.
  </li>
  <li>
    <strong>POST <code>/login</code></strong><br />
    Logs in a user and returns an authentication token.<br />
    <strong>Request Body:</strong> &#123; email, password &#125;<br />
    <strong>Response:</strong> JWT token for authentication.
  </li>
  <li>
    <strong>GET <code>/me</code></strong><br />
    Gets the profile of the currently authenticated user.<br />
    <strong>Headers:</strong> Authorization: Bearer &lt;token&gt;<br />
    <strong>Response:</strong> User info (id, name, email).
  </li>
</ul>

<h3>Notes Routes (<code>/api/notes</code>)</h3>

<p>All routes below require authentication (send JWT token in Authorization header).</p>

<ul>
  <li>
    <strong>POST <code>/</code></strong><br />
    Create a new note.<br />
    <strong>Request Body:</strong> &#123; title, content &#125;<br />
    <strong>Response:</strong> Created note ID.
  </li>
  <li>
    <strong>GET <code>/</code></strong><br />
    Get all notes of the authenticated user, with optional filtering, sorting, and pagination.<br />
    <strong>Query Parameters:</strong><br />
    &nbsp;&nbsp;- <code>categoryId</code> (array of category IDs to filter by)<br />
    &nbsp;&nbsp;- <code>limit</code> (number of notes to return)<br />
    &nbsp;&nbsp;- <code>offset</code> (pagination offset)<br />
    &nbsp;&nbsp;- <code>sortBy</code> (field to sort by, e.g., created_at)<br />
    &nbsp;&nbsp;- <code>order</code> (ASC or DESC)<br />
    &nbsp;&nbsp;- <code>search</code> (search text in title or content)<br />
    <strong>Response:</strong> List of notes.
  </li>
  <li>
    <strong>GET <code>/:id</code></strong><br />
    Get a specific note by ID (only if owned by user).<br />
    <strong>Response:</strong> Note object.
  </li>
  <li>
    <strong>PUT <code>/:id</code></strong><br />
    Update a specific note by ID.<br />
    <strong>Request Body:</strong> &#123; title, content &#125;<br />
    <strong>Response:</strong> Number of affected rows.
  </li>
  <li>
    <strong>DELETE <code>/:id</code></strong><br />
    Delete a specific note by ID.<br />
    <strong>Response:</strong> Number of affected rows.
  </li>
</ul>

<h3>Categories Routes (<code>/api/categories</code>)</h3>

<p>All routes below require authentication.</p>

<ul>
  <li>
    <strong>GET <code>/notes/:id/categories</code></strong><br />
    Get all categories linked to a specific note.<br />
    <strong>Response:</strong> Array of categories.
  </li>
  <li>
    <strong>GET <code>/</code></strong><br />
    Get all categories visible to the user (including predefined categories).<br />
    <strong>Response:</strong> Array of categories.
  </li>
  <li>
    <strong>DELETE <code>/:id</code></strong><br />
    Delete a specific user-created category by ID.<br />
    <strong>Response:</strong> Status (success/failure).
  </li>
  <li>
    <strong>DELETE <code>/</code></strong><br />
    Delete all user-created categories belonging to the authenticated user.<br />
    <strong>Response:</strong> Status.
  </li>
</ul>

<h3>Authentication Middleware</h3>

<p>Protects all <code>/notes</code> and <code>/categories</code> routes to ensure only authenticated users can access.</p>


<h1>Database Schema</h1>

<p>This project uses a MySQL database with the following tables:</p>

<ul>
  <li>
    <strong>users</strong>: Stores user information.<br />
    Columns: <code>id (PK)</code>, <code>name</code>, <code>email (unique)</code>, <code>password (hashed)</code>
  </li>
  <li>
    <strong>notes</strong>: Stores notes created by users.<br />
    Columns: <code>id (PK)</code>, <code>user_id (FK to users.id)</code>, <code>title</code>, <code>content</code>, <code>created_at</code>, <code>updated_at</code>
  </li>
  <li>
    <strong>categories</strong>: Stores categories, some predefined (user_id is NULL) and some user-created.<br />
    Columns: <code>id (PK)</code>, <code>name</code>, <code>user_id (nullable FK to users.id)</code>
  </li>
  <li>
    <strong>notecategories</strong>: Many-to-many relationship table between notes and categories.<br />
    Columns: <code>note_id (FK to notes.id)</code>, <code>category_id (FK to categories.id) </code>, <code>(note_id, category_id) (PK)</code>
  </li>
</ul>

<h2>Initial Data</h2>

<h3>Table Creation Queries</h3>

<pre><code>
-- Users table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL
);

-- Notes table
CREATE TABLE notes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  user_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Categories table
CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  user_id INT,
  CONSTRAINT unique_user_category UNIQUE (user_id, name),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

<p>
  <strong>Note:</strong> The <code>categories</code> table includes a
  <code>unique_user_category</code> constraint to ensure that a user cannot create
  two categories with the same name.
</p>

-- NoteCategories table (for many-to-many relation between notes and categories)
CREATE TABLE notecategories (
    note_id INT NOT NULL,
    category_id INT NOT NULL,
    PRIMARY KEY (note_id, category_id),
    FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);
</code></pre>

<h3>Predefined Categories</h3>
<p>These categories are inserted by default and have <code>user_id = NULL</code> to indicate they are global.</p>

<pre><code>
INSERT INTO categories (name, user_id) VALUES
('Ideas', NULL),
('Work', NULL),
('Personal', NULL),
('Important', NULL);
</code></pre>

<h1>Environment Setup</h1>

<h3>1. Clone the Repository</h3>
<pre><code>https://github.com/birajchhetri30/Note-Taking-App.git
cd Note-Taking-App</code></pre>

<h3>2. Install Dependencies</h3>
<pre><code>npm install</code></pre>

<h3>3. Configure Environment Variables</h3>
<p>Create a <code>.env</code> file in the backend root by copying <code>.env.example</code> and filling in the actual credentials.</p>

<h3>4. Start the Server</h3>
<pre><code>npm run dev</code></pre>

