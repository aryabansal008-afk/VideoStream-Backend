# VideoStream Backend

A scalable backend for a video streaming platform built with Node.js, Express.js, MongoDB and Mongoose. The project provides RESTful APIs for authentication, video management, playlists, comments, likes, subscriptions, tweets and channel analytics.

## Features

### Authentication

* User registration
* User login & logout
* JWT Access & Refresh Tokens
* Refresh token rotation
* Change password
* Update account details
* Update avatar & cover image
* Watch history

### Video Management

* Upload videos
* Upload thumbnails
* Cloudinary integration
* Get all videos with search, sorting, and pagination
* Get video by ID
* Update video details
* Delete video
* Toggle publish/unpublish status

### Comments

* Add comment
* Update comment
* Delete comment
* Get comments for a video with pagination

### Likes

* Like/Unlike videos
* Like/Unlike comments
* Like/Unlike tweets
* Get liked videos

### Subscriptions

* Subscribe/Unsubscribe to channels
* Get channel subscribers
* Get channels subscribed by a user

### Playlists

* Create playlist
* Update playlist
* Delete playlist
* Get playlist by ID
* Get user playlists
* Add video to playlist
* Remove video from playlist

### Tweets

* Create tweet
* Update tweet
* Delete tweet
* Get user tweets

### Dashboard

* Channel statistics
* Total videos
* Total views
* Total subscribers
* Total likes
* Get all uploaded channel videos

### Health Check

* Server health check endpoint

## Tech Stack

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Multer
* Cloudinary
* bcrypt
* Cookie Parser
* CORS
* dotenv


## Installation

```bash
git clone <repository-url>
cd VideoStream
npm install
```

Create a `.env` file with the required environment variables:

```env
PORT=8000

MONGODB_URI=
DB_NAME=

ACCESS_TOKEN_SECRET=
ACCESS_TOKEN_EXPIRY=

REFRESH_TOKEN_SECRET=
REFRESH_TOKEN_EXPIRY=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

CORS_ORIGIN=
```

Run the server:

```bash
npm run dev
```

## API Modules

* Authentication
* Users
* Videos
* Comments
* Likes
* Subscriptions
* Playlists
* Tweets
* Dashboard
* Health Check

## Tools Used

* Postman
* Cloudinary
* MongoDB Atlas
* Git & GitHub

