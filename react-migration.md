# React + Tailwind Migration Plan

## Background & Motivation
The current portfolio website is built using vanilla HTML, CSS, and JS. The goal is to modernize the tech stack by migrating it to a React frontend with a gorgeous, modern design powered by Tailwind CSS. This will ensure fast performance, easier maintainability, and a more professional look.

## Scope & Impact
- **To be migrated to React & Tailwind:** Main site pages (`index.html`, `journal.html`, `work.html`) and sub-projects (`layout/`, `personal/`, `lab51/`, `lab71/`, `gizmos/`).
- **To remain vanilla (moved to `public/`):** `team/`, `burgerclicker/`, `js_assignment/`.
- **Infrastructure:** The site will be built with Vite and hosted on GitHub Pages using `HashRouter`. The GitHub Actions deployment workflow will be updated to support the new build process.

## Proposed Solution
1. **Initialize Project:** Create a new Vite React TypeScript project at the repository root and install Tailwind CSS.
2. **Preserve Vanilla Projects:** Move the excluded vanilla directories into the Vite `public/` folder so they are served correctly.
3. **Component Migration:** Rebuild the layout and pages as React components, utilizing Tailwind for a cohesive, modern UI.
4. **Sub-project Migration:** Convert the smaller HTML/JS labs and demos into React components, keeping their original logic but adapting it to the React ecosystem.
5. **Deployment:** Adjust the GitHub Actions workflow to build the React project and deploy the `dist/` directory.

## Implementation Plan

### Phase 1: Setup & Initialization
- Initialize Vite at the root: `npm create vite@latest . -- --template react-ts`.
- Install dependencies: `npm install`, `npm install -D tailwindcss postcss autoprefixer react-router-dom`.
- Configure Tailwind CSS: Initialize `tailwind.config.js` and set up `index.css`.
- Update `vite.config.ts` if necessary for base paths or build settings.

### Phase 2: Asset Relocation
- Create a `public/` directory (if not generated).
- Move `burgerclicker/`, `js_assignment/`, and `team/` into `public/`.
- Move other static assets (images, raw CSS/JS) into `src/assets/` or `public/` as appropriate.

### Phase 3: Core Components & Routing
- Set up `HashRouter` in `src/main.tsx` and define routes in `src/App.tsx`.
- Create layout components: `Navbar.tsx`, `Footer.tsx` with a modern Tailwind design.
- Create main pages: `Home.tsx`, `Journal.tsx`, `Work.tsx`.

### Phase 4: Sub-project Migration
- Migrate `layout/` to `src/pages/projects/Layout.tsx`.
- Migrate `personal/3D_Demo/` to `src/pages/projects/Personal3D.tsx`.
- Migrate `lab51/catchTheRabbit/` to `src/pages/projects/CatchTheRabbit.tsx`.
- Migrate `lab71/` to `src/pages/projects/Lab71.tsx`.
- Migrate `gizmos/mp3/` to a dedicated React component.

### Phase 5: Styling & Polish
- Apply Tailwind utility classes to ensure a "gorgeous, modern design".
- Ensure mobile responsiveness and fast rendering performance.
- Clean up old vanilla HTML/CSS/JS files from the root.

### Phase 6: CI/CD Update
- Update `.github/workflows/deploy.yml` to build at the root (`npm ci`, `npm run build`) and deploy `./dist`.

## Verification
- Run `npm run dev` and verify all React pages load correctly and routing works.
- Navigate to `/burgerclicker/index.html`, `/js_assignment/index.html`, and `/team/index.html` to confirm the vanilla sites still function perfectly without React interference.
- Build the project with `npm run build` to verify no compilation errors.

## Migration & Rollback
- **Migration:** All work will be done on the main branch, deleting old files and replacing them with the React app structure.
- **Rollback:** In case of critical failure, `git reset --hard HEAD` (to the commit prior to this migration) will revert the entire repository back to the vanilla state.