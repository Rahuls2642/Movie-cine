🎬 Moviecine – Full Stack Movie App

Movie cine is a full-stack movie application built with the MERN stack (MongoDB, Express, React, Node.js) that lets users explore movies, manage their personal watchlist, mark watched movies, and write reviews — all with secure authentication and a clean, modern UI.

This project shows my ability to design, structure, and implement a complete end-to-end web app — from REST APIs and JWT authentication to React front-end integration and database relationships.

🚀 Features

🔐 User System

- Register and login securely with JWT authentication.

- Passwords hashed and validated using bcrypt.

- Each user has their own data (watchlist, watched movies, and reviews).

🎥 Movie Management

- Browse movies with search

- View detailed movie info (fetched from TMDb API).

- Add movies to your watchlist or mark them as watched.

- Real-time UI updates after adding or removing movies.

✍️ Reviews & Ratings

- Write reviews and rate movies from 1 to 10.

- Reviews tied directly to each user and movie.

- See all public reviews for any movie.

- Update or delete your own reviews.

🧾 Profile Page

- Dashboard displaying:

- Number of movies in watchlist

- Number of movies watched

- All reviews written by the user

- Ability to delete reviews directly from the profile.

🖤 Modern UI

- Responsive, cinematic design inspired by streaming platforms.

- Dark mode layout with red highlights.
  
- Built with Tailwind CSS and React Router for smooth navigation.


🧩 Tech Stack

| Layer          | Technologies                                   |
| -------------- | ---------------------------------------------- |
| **Frontend**   | React, Vite, React Router, Axios, Tailwind CSS |
| **Backend**    | Node.js, Express.js, MongoDB, Mongoose         |
| **Auth**       | JWT (JSON Web Tokens), bcrypt                  |
| **Database**   | MongoDB Atlas                                  |
| **API Source** | The Movie Database (TMDb) API                  |
| **Deployment** | Render                                         |

🛠️ Setup & Installation

-  the repository
git clone [https://github.com/Rahuls2642/Movie-cine.git]
cd cinehub

- Backend setup
npm run dev

- Frontend setup
cd ../frontend
npm install

- Create a .env file:
VITE_TMDB_API_KEY=your_tmdb_api_key

- Run frontend:
npm run dev

🧠 What I Learned

- How to design a clean, scalable MERN backend architecture (models, routes, controllers).

- Handling authentication and protected routes using JWT and middleware.

- Building responsive, interactive React pages that connect to an API.

- Managing real-time UI updates and conditional rendering based on user state.

- Handling async operations safely using custom asyncHandler.

- Integrating third-party APIs (TMDb) for dynamic movie data.

🪄 Highlights

- Full user-based data isolation: each user's data lives in their own MongoDB documents.

- Reusable and modular code — backend easily extendable for features like favorites or comments.

- Clean, modern design that matches current movie platforms.

- API and UI both designed with developer experience and clarity in mind.

🔮 Future Improvements

- Add OAuth login (Google).

- Allow users to upload profile avatars.

- Integrate a “Movie of the Week” recommendation feature.

🧑‍💻 Author

Rahul Singh
Full Stack  Developer | MERN Stack
📧 [rahuls6408@gmail.com]
🌐 [https://bejewelled-crostata-952167.netlify.app/]

💬 Summary

CineHub is a complete demonstration of real-world full-stack development — not just another CRUD app.
It ties together authentication, API consumption, user-generated content, and a polished UI — all built from scratch.

“Built to look good. Structured to scale. Designed to impress.”
