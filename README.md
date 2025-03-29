# Movie Recommendation System

A full-stack movie recommendation system built with React.js and Node.js. The system allows users to browse movies, get personalized recommendations, and rate movies.

## Features

- User authentication (signup/login)
- Browse featured and popular movies
- Search movies by title or description
- View detailed movie information
- Rate movies
- Get personalized recommendations based on ratings

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v8 or higher)
- npm or yarn

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd movie-recommendation-system
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
PORT=7777
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=moviestream
JWT_SECRET=your_jwt_secret_key
```

4. Create a MySQL database and set up the schema:
```bash
mysql -u root -p < database/schema/database.sql
```

5. Run database scripts:
```bash
# Check database columns
npm run db:check

# Add user clicks column
npm run db:add-clicks

# List all movies
npm run db:list

# Test movie interactions
npm run db:test
```

6. Start the server:
```bash
# For development with auto-reload
npm run dev

# OR for production
npm start
```

## Project Structure

```
project/
├── database/
│   ├── schema/
│   │   └── database.sql
│   └── scripts/
│       ├── check_all_columns.js
│       ├── add_user_clicks.js
│       ├── list_movies.js
│       └── test_interactions.js
├── public/
│   ├── js/
│   ├── css/
│   └── images/
├── utils/
│   └── movieInteractions.js
├── server.js
├── package.json
└── README.md
```

## API Endpoints

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/featured-movies` - Get featured movies
- `GET /api/movies/popular` - Get popular movies
- `GET /api/movies/:id` - Get movie by ID
- `GET /api/search` - Search movies

## Frontend

The frontend is built with React.js and includes:

- Modern, responsive UI
- User authentication forms
- Movie browsing interface
- Search functionality
- Movie details view
- Rating system

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Font Awesome for icons
- TMDB for movie data (if used)
- Any other third-party resources used in the project 