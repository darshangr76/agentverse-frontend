const BACKEND = import.meta.env.VITE_BACKEND_API || "http://127.0.0.1:8000";

export async function createProject(requirement) {
  const r = await fetch(`${BACKEND}/projects`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ requirement }),
  });
  if (!r.ok) throw new Error(`Create failed: ${r.status}`);
  return r.json();
}

export async function planProject(projectId) {
  const r = await fetch(`${BACKEND}/projects/${projectId}/plan`, {
    method: "POST",
  });
  if (!r.ok) throw new Error(`Plan failed: ${r.status}`);
  return r.json();
}

export async function runProject(projectId) {
  const r = await fetch(`${BACKEND}/projects/${projectId}/run`, {
    method: "POST",
  });
  if (!r.ok) throw new Error(`Run failed: ${r.status}`);
  return r.json();
}

export async function getProject(projectId) {
  const r = await fetch(`${BACKEND}/projects/${projectId}`);
  if (!r.ok) throw new Error(`Get failed: ${r.status}`);
  return r.json();
}

export function pollProject(projectId, onUpdate, intervalMs = 2000) {
  const timer = setInterval(async () => {
    try {
      const data = await getProject(projectId);
      onUpdate(data);
      if (data.status === "completed" || data.status === "failed") {
        clearInterval(timer);
      }
    } catch (err) {
      console.error("Poll error", err);
    }
  }, intervalMs);
  return () => clearInterval(timer);
}
