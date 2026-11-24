# CivicEvents frontend

## Run the app

The frontend is static and uses HTML, Tailwind CSS from its CDN, and jQuery
from its CDN. It requires no framework build step.

1. Start the CivicEvents backend on `http://localhost:4000`.
2. Serve this `frontend` directory with any static HTTP server, for example:

   ```powershell
   cd frontend
   python -m http.server 5500
   ```

3. Open `http://localhost:5500/index.html`.

The backend API base URL is configured in `js/config.js` as
`http://localhost:4000`.

## Main shared files

- `js/config.js`: API base URL.
- `js/auth.js`: token and user session storage, plus login/admin guards.
- `js/api.js`: bearer-authenticated jQuery requests and 401/403/network error handling.
- `js/layout.js`: shared navbar, notification drawer, footer, and toast function.
- `css/styles.css`: shared accessible fallback styles.

## Role-based guards

Role-based access checks are implemented in `js/auth.js`:

- `requireLogin()` protects authenticated pages.
- `requireAdmin()` protects admin pages and redirects normal users.

Admin-only controls are also rendered only when `Auth.getUser().role === "admin"`.
The admin guard is used on dashboard and user management pages, as well as event,
announcement, promo, and broadcast notification management controls. The server
also authorizes protected API routes; frontend guards improve navigation and
must not replace backend authorization.