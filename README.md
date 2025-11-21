# LondonJamesD.github.io
A simple portfolio and documentation center

This repository now contains a minimal full-stack scaffold:

- `backend/` — a Java Spring Boot backend with a small `/api/hello` endpoint.
- `frontend/` — a Vite + React frontend that queries the backend and shows a simple UI.

Getting started (development)

1. Start the backend (requires Java 17+ and Maven):

```bash
# from repository root
mvn -f backend spring-boot:run
```

2. Start the frontend (requires Node 18+/npm):

```bash
cd frontend
npm install
npm run dev
```

The frontend dev server will proxy requests to `localhost:5173` by default; the React app expects the backend API at `/api/hello` (when running both locally, use the above ports or update proxy configuration).

Production build (optional)

1. Build the frontend:

```bash
cd frontend
npm run build
```

2. Copy the `dist` output into Spring Boot static resources and build the backend jar:

```bash
rm -rf backend/src/main/resources/static/*
cp -r frontend/dist/* backend/src/main/resources/static/
mvn -f backend package
java -jar backend/target/demo-0.0.1-SNAPSHOT.jar
```

This will serve the frontend as static files from the Spring Boot application.

Next steps

- Customize `frontend/src/App.jsx` and add pages/components.
- Add additional REST endpoints under `backend/src/main/java/com/example/demo`.
- Configure CORS, authentication, or a CI/CD pipeline as needed.

If you'd like, I can:

- Add an npm proxy configuration to forward API requests to the backend during dev.
- Wire the build process so `mvn package` automatically builds the frontend.
- Scaffold pages (About, Projects, Docs) and routing in React.

Tell me which next step you prefer.

GitHub Pages (static hosting)

- This repository includes a GitHub Actions workflow that builds the frontend and publishes `frontend/dist` to GitHub Pages when you push to `main`.
- Because GitHub Pages is static, only the frontend is hosted there — the Spring Boot backend cannot run on GitHub Pages. The frontend will display a fallback message when the backend is unavailable.
- The Vite build `base` is set to `/LondonJamesD.github.io/` so assets load correctly on the repository's GitHub Pages URL: `https://LondonJamesD.github.io/`.

If you want the frontend to call a live backend in production, deploy the backend separately (e.g., Heroku, Render, Railway, or a VPS) and update `frontend/src/App.jsx` to call that API URL.
