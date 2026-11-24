=# CivicEvents Frontend

Frontend for the CivicEvents+ portal, built with HTML, Tailwind CSS (CDN) and jQuery (CDN). There is no build step.

## Run the backend

1. Install Node.js (v18+) and PostgreSQL (v15+).
2. Create the database `civic-events-db`.
3. From the `backend` folder, create the tables:
   `psql -U postgres -h localhost -d "civic-events-db" -f migrations/001_create_tables.sql`
4. Set your database credentials in `backend/.env`.
5. Run `npm install`, then `npm run dev`.
6. The API runs at `http://localhost:4000`.

## Run the frontend

1. The API base URL is set in `frontend/js/config.js`:
   `const BASE_URL = "http://localhost:4000";`
2. Open `frontend/index.html` with the VS Code **Live Server** extension, or serve the `frontend` folder with any static server.
3. Sign up, then log in.

## Create an admin account

Sign-up creates normal users. To make an admin, sign up first, then run:

`psql -U postgres -h localhost -d "civic-events-db" -c "UPDATE users SET role='admin' WHERE email='YOUR_EMAIL';"`

Log out and log in again.

## Features

- Sign up (password strength meter) and login (remember me)
- Events: list, search, filters, sort, pagination, detail, registration, feedback
- Admin: create, edit and delete events, announcements (audio) and promos (video + captions)
- Notifications drawer with unread count
- Admin dashboard and user management (enable/disable)
- Profile page, dark mode, responsive mobile menu

## Project structure

- `js/config.js`: API base URL
- `js/auth.js`: token and user storage, role guards
- `js/api.js`: authenticated requests, 401/403/network error handling
- `js/layout.js`: navbar, notification drawer, footer, toasts
- `pages/`: all pages
- `css/styles.css`: shared styles

## Role-based access guards

- `js/auth.js`: `requireLogin()` protects pages for logged-in users. `requireAdmin()` protects admin pages and redirects normal users.
- Admin-only buttons and links (add, edit, delete, dashboard, users) are only shown when `Auth.getUser().role === "admin"`.
- `js/api.js`: a 401 response clears the session and redirects to login. A 403 response shows a forbidden message.
- Frontend guards only improve the user experience. The backend enforces the real security.

## Known backend limits

The provided backend has no route to create a broadcast notification and no endpoint to mark a notification as read, so read state is stored on the client still working on it though.