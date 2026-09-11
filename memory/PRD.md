# PRD — Web Portfolio + Admin CMS (UI/UX Designer)

## Original Problem Statement
Website portfolio pribadi bergaya Behance untuk UI/UX Designer: halaman publik elegan (light theme, hero & closing gelap hitam+biru sparkle) + panel admin CRUD dilindungi login JWT (httpOnly cookie). Konten: Hero, About (bio, foto, name card, hard/soft skills, tools, kontak), Experience timeline, Selected/Other Projects, Project Detail (cover, overview, role, tools, palet hex, typography, galeri, link, outcome), Get In Touch statis + CTA, Download CV. Admin: dashboard, CRUD hero/about, skills & tools (urutkan), experience, projects, settings (CV PDF, SEO/OG, kontak, social). Upload gambar ke folder lokal lewat storage service abstrak. MongoDB dengan repository layer terpisah.

## User Choices
- React (CRA + JS) + Tailwind + Framer Motion (bukan Vite/TS)
- Admin seed: `admin` / `Admin@12345`
- JWT di httpOnly cookie
- Konten awal dummy placeholder (diedit via admin)
- Closing section memakai tema dark hero yang sama (bookend)

## Architecture
- **Backend** (`/app/backend`): FastAPI. `server.py` (app + startup seed), `auth.py` (bcrypt, PyJWT access 60m / refresh 7d, brute-force lock), `models.py` (BaseDocument/PyObjectId), `repository.py` (MongoRepository / SingletonRepository — swap point for other DBs), `storage.py` (StorageService abstract + LocalStorageService → `/api/uploads`), `routes_content.py` (public + generic admin CRUD + reorder), `routes_upload.py`, `seed.py`.
- **Frontend** (`/app/frontend/src`): `lib/api.js` (axios withCredentials + refresh interceptor, assetUrl), `context/AuthContext`, pages `Home`, `ProjectDetail`, `admin/*` (Login, Layout, Dashboard, ProfileEditor, SkillsTools, ExperiencesAdmin, ProjectsAdmin, ProjectForm, Settings), components `public/*` (DarkBackdrop, Hero, About, Experience, Projects, GetInTouch, ProjectSpecs, Motion), `admin/*`.
- **DB collections**: admin_users, profile (singleton), skills, tools, experiences, projects, login_attempts.

## Implemented (Jun 2026)
- [x] JWT auth (login/logout/me/refresh/change password), seeded admin, protected admin routes
- [x] Public site: Hero, About, Experience, Selected + Other Projects, Project Detail (palette swatches w/ copy, typography, gallery), Get In Touch dark bookend, Download CV, SEO/OG meta (client-side)
- [x] Admin CRUD: profile (hero/about), skills/tools (add/delete/reorder), experiences, projects (palette, typography, gallery, featured, auto slug), settings (contact, social, CV PDF, SEO/OG image, password)
- [x] Local image/PDF upload via abstract storage, served at `/api/uploads`
- [x] Framer Motion reveals, page transitions, hover lift/filter; responsive
- [x] Tested: 20/20 backend pytest, all frontend flows (iteration_1)
- [x] Drag & drop reorder (framer-motion Reorder) untuk skills/tools & projects admin
- [x] Case study lengkap: Problem, Goal, Process steps, KPI/Impact cards (model → admin form → detail page)
- [x] Redesign About photo card (overlay nama/role, badge lokasi, floating badge tahun pengalaman); QA mobile 390px tanpa overflow
- [x] Tested iteration_2: 24/24 backend, semua alur drag/case-study lolos; fix loop update-depth di Reorder
- [x] Revisi UI (iter 3): hero lebih ringkas di desktop, badge tahun di foto dihapus, ikon tools seragam 32px, related projects dihapus dari detail, tipografi mobile diperkecil + overflow-x hidden, galeri project jadi slider (embla) dengan prev/next/dots

## Backlog
- P1: Server-side OG meta for social crawlers (currently client-side only)
- P2: Object storage adapter (S3/Emergent) implementing StorageService
- P2: MariaDB/SQL repository implementation
- P2: Rich text editor for bio/overview; image cropping

## Notes
- CORS_ORIGINS="*" works because same origin via ingress; set explicit domain for self-host.
- Reset admin password: change ADMIN_PASSWORD in backend/.env and restart (seed updates hash).
