🔗 **Live Demo:** https://agentverse-frontend-eight.vercel.app
# AGENTVERSE Frontend Handoff

This package contains the AGENTVERSE React/Vite frontend source prepared for integration with the team's backend and AI-agent system.

## Run

```bash
npm install
npm run dev
```

The Vite app normally opens on port 5173; if that port is busy Vite may use 5174.

## Environment

Copy `.env.example` to `.env` and fill in the Supabase project values.

Do NOT put service-role keys or other server secrets in the frontend.

## Integration target

The existing team backend is expected to run on:

`http://127.0.0.1:8000`

Expected project workflow from the backend handoff:

`POST /projects`

`POST /projects/{project_id}/plan`

`POST /projects/{project_id}/run`

`GET /projects/{project_id}`

The frontend currently contains the visual Agentverse workspace and simulated workflow. The next integration step is to replace the simulated build action with calls to the real backend and display the returned agent/project state.
