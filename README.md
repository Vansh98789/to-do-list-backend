To-Do List API
This is a simple REST API service for managing a to-do list. It allows users to create, read, update, and delete tasks. The API is built using Node.js, Express, and SQLite 

Features
POST /tasks: Create a new task with a title, description, and default status 
GET /tasks: Fetch all tasks.
GET /tasks/:id: Fetch a task by its ID.
PUT /tasks/:id: Update the status of a task 
DELETE /tasks/:id: Delete a task by its ID.


Prerequisites
Node.js installed on your machine.
A terminal (command line interface) to run the commands.

Installation
Clone the repository or create a new directory:
Copy code
git clone https://github.com/Vansh98789/to-do-list-backend.git
cd to-do-backend

Install dependencies:
Copy code
npm install

To start the server, run the following command:

Copy code
node app.js
The server will start and listen on port 3000 by default.

