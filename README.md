
## Introduction

The Finonex Server is a crucial component of the Finonex platform, responsible for processing live events, managing user revenue data, and initializing the database. It provides RESTful APIs for clients to interact with.

## Features

- **Live Event Processing:** Accepts live events via a POST request, authenticates them, saves them as JSON files, and triggers data processing for each event.

- **User Revenue Data:** Retrieves user revenue data via a GET request by specifying a user ID. The data is fetched from the PostgreSQL database.

- **Database Initialization:** Initializes the PostgreSQL database on startup, ensuring that the required table for user revenue data exists.

## Getting Started

Follow the steps below to get started with the Finonex Server.

### Prerequisites

Before you begin, ensure you have the following prerequisites:

- Node.js installed on your system.
- PostgreSQL database configured with the required credentials.

### Installation

1. Clone the repository to your local machine:

   git clone https://github.com/dorvardi31/Finonex
Navigate to the project directory:

cd Finonex
Install the dependencies:

npm install
Configure your database connection by modifying the pool object in server.js and data_processing.

Start the server:

npm start
The server will start on port 8000.

Usage
Live Event Processing
To send a live event for processing, make a POST request to the /liveEvent endpoint with a JSON payload. Include an Authorization header with the value 'secret' for authentication.

Example:

curl -X POST -H "Authorization: secret" -H "Content-Type: application/json" -d '{"userId": "user123", "revenue": 100}' http://localhost:8000/liveEvent
User Revenue Data
To retrieve user revenue data, make a GET request to the /userEvents/:userid endpoint, replacing :userid with the user's ID.

Example:

curl http://localhost:8000/userEvents/user123
Configuration
You can configure the server by modifying the pool object in server.js. Update the database credentials and connection settings to match your environment.

