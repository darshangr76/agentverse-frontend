
import { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import { createProject, planProject, runProject, pollProject } from "./api/backendClient";
const agents = [
  {
    id: "orchestrator",
    name: "ORCHESTRATOR",
    role: "Coordinates the entire engineering team",
    number: "01",
    description:
      "Understands the requirement, delegates work, evaluates progress and decides which specialist should act next.",
  },
  {
    id: "planner",
    name: "PLANNER",
    role: "Architecture & task planning",
    number: "02",
    description:
      "Breaks the requirement into architecture, components, data structures and actionable engineering tasks.",
  },
  {
    id: "builder",
    name: "BUILDER",
    role: "Implementation",
    number: "03",
    description:
      "Transforms the approved plan into application code and implementation artifacts.",
  },
  {
    id: "tester",
    name: "TESTER",
    role: "Quality & verification",
    number: "04",
    description:
      "Runs checks against the generated application and identifies functional or implementation failures.",
  },
  {
    id: "fixer",
    name: "FIXER",
    role: "Failure recovery",
    number: "05",
    description:
      "Analyzes failures and proposes targeted corrections before sending work back into the engineering loop.",
  },
  {
    id: "deployer",
    name: "DEPLOYER",
    role: "Release & delivery",
    number: "06",
    description:
      "Prepares the validated application for deployment and final delivery.",
  },
];

const buildTypes = [
  {
    id: "website",
    title: "Website",
    description: "Landing pages, portfolios and content-driven experiences.",
    icon: "◌",
  },
  {
    id: "web-app",
    title: "Web Application",
    description: "Interactive applications with users, data and workflows.",
    icon: "⌘",
  },
  {
    id: "mobile",
    title: "Mobile Application",
    description: "Mobile-first products for modern devices.",
    icon: "▯",
  },
  {
    id: "ai",
    title: "AI Application",
    description: "AI-powered products, assistants and intelligent workflows.",
    icon: "✦",
  },
  {
    id: "saas",
    title: "SaaS Product",
    description: "Scalable software products with accounts and services.",
    icon: "◇",
  },
  {
    id: "api",
    title: "API / Backend",
    description: "Backend services, APIs and data-driven systems.",
    icon: "⌁",
  },
  {
    id: "data",
    title: "Data / ML Project",
    description: "Data science, machine learning and analytics systems.",
    icon: "∿",
  },
  {
    id: "automation",
    title: "Automation",
    description: "Automated workflows, agents and repetitive processes.",
    icon: "↗",
  },
  {
    id: "other",
    title: "Something Else",
    description: "Tell Agentverse what you have in mind.",
    icon: "+",
  },
];

const roles = [
  "Student",
  "Working Professional",
  "Web Developer",
  "Software Developer",
  "AI / ML Developer",
  "Data Scientist",
  "Designer",
  "Researcher",
  "Entrepreneur / Founder",
  "Product Manager",
  "Hobbyist",
  "Other",
];

const liveEvents = [
  "Orchestrator is analyzing the requirement",
  "Planner is preparing the architecture",
  "Builder is preparing implementation tasks",
  "Tester is preparing verification criteria",
  "Agents are exchanging project context",
  "Quality loop is standing by",
  "Deployment pathway is ready",
];

function App() {
  const [darkMode, setDarkMode] = useState(true);

  const [screen, setScreen] = useState("welcome");
  const [authMode, setAuthMode] = useState("login");

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [profile, setProfile] = useState({
    role: "",
    buildType: "",
    idea: "",
  });

  const [activeAgent, setActiveAgent] = useState("orchestrator");
  const [running, setRunning] = useState(false);
  const [buildStep, setBuildStep] = useState(0);
  const [eventIndex, setEventIndex] = useState(0);
  const [showNotification, setShowNotification] = useState(false);

  const [files, setFiles] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [projectId, setProjectId] = useState(null);
  const [projectData, setProjectData] = useState(null);
  const [swarmLogs, setSwarmLogs] = useState([]);
  const pollCleanupRef = useRef(null);


  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (event) => {
      document.documentElement.style.setProperty(
        "--mouse-x",
        `${event.clientX}px`
      );

      document.documentElement.style.setProperty(
        "--mouse-y",
        `${event.clientY}px`
      );
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setDragging(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (!running) return;

    const timer = setInterval(() => {
      setBuildStep((current) => {
        if (current >= agents.length - 1) {
          setRunning(false);
          return current;
        }

        return current + 1;
      });
    }, 1400);

    return () => clearInterval(timer);
  }, [running]);

  useEffect(() => {
    const timer = setInterval(() => {
      setEventIndex((current) => (current + 1) % liveEvents.length);
    }, 2400);

    return () => clearInterval(timer);
  }, []);

  const glitters = useMemo(() => {
    return Array.from({ length: 120 }, (_, index) => {
      const left = (index * 37) % 101;
      const top = (index * 61) % 101;
      const moveX = -100 + ((index * 47) % 200);
      const moveY = -120 + ((index * 73) % 240);
      const size = 2 + (index % 4);
      const duration = 5 + (index % 8);
      const twinkle = 1.5 + (index % 4) * 0.5;
      const delay = -(index % 10);

      return (
        <span
          key={index}
          className="glitter"
          style={{
            "--left": `${left}%`,
            "--top": `${top}%`,
            "--size": `${size}px`,
            "--move-x": `${moveX}px`,
            "--move-y": `${moveY}px`,
            "--duration": `${duration}s`,
            "--twinkle": `${twinkle}s`,
            "--delay": `${delay}s`,
          }}
        />
      );
    });
  }, []);

  const selectedAgent =
    agents.find((agent) => agent.id === activeAgent) || agents[0];

  const goTo = (nextScreen) => {
    setScreen(nextScreen);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submitLogin = (event) => {
    event.preventDefault();

    if (!user.email || !user.password) {
      setShowNotification(true);
      return;
    }

    if (authMode === "signup" && !user.name) {
      setShowNotification(true);
      return;
    }

    setShowNotification(false);

    if (authMode === "signup") {
      goTo("onboarding-role");
    } else {
      goTo("workspace");
    }
  };

  const handleRoleSelect = (role) => {
    setProfile((current) => ({
      ...current,
      role,
    }));
  };

  const handleBuildTypeSelect = (buildType) => {
    setProfile((current) => ({
      ...current,
      buildType,
    }));
  };

  const handleFiles = (selectedFiles) => {
    const incomingFiles = Array.from(selectedFiles || []);

    if (!incomingFiles.length) return;

    setFiles((current) => {
      const combined = [...current, ...incomingFiles];

      const unique = combined.filter(
        (file, index, array) =>
          index ===
          array.findIndex(
            (item) =>
              item.name === file.name &&
              item.size === file.size &&
              item.lastModified === file.lastModified
          )
      );

      return unique;
    });
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);
    handleFiles(event.dataTransfer.files);
  };

  const removeFile = (indexToRemove) => {
    setFiles((current) =>
      current.filter((_, index) => index !== indexToRemove)
    );
  };

const startBuild = async () => {
  if (!profile.idea.trim()) {
    setShowNotification(true);
    return;
  }

  setShowNotification(false);
  setBuildStep(0);
  setActiveAgent("orchestrator");
  setRunning(true);
  setSwarmLogs([]);
  setProjectData(null);

  try {
    const created = await createProject(profile.idea);
    const pid = created.project.project_id;
    setProjectId(pid);

    await planProject(pid);

    runProject(pid).catch((e) => console.error("Run error", e));

    pollCleanupRef.current = pollProject(pid, (data) => {
      setProjectData(data);

      const statusMap = {
        created: 0,
        planning: 1,
        architecture: 1,
        coding: 2,
        testing: 3,
        debugging: 4,
        security: 5,
        deployment: 5,
        completed: 5,
      };
      const idx = statusMap[data.status] ?? 0;
      setBuildStep(idx);

      const agentIds = ["orchestrator", "planner", "builder", "tester", "fixer", "deployer"];
      setActiveAgent(agentIds[idx] || "orchestrator");

      if (data.logs) {
        setSwarmLogs(data.logs.map((l) => `[${l.agent}] ${l.message}`));
      }

      if (data.status === "completed" || data.status === "failed") {
        setRunning(false);
      }
    });
  } catch (err) {
    console.error("Build error", err);
    setRunning(false);
    setShowNotification(true);
  }
};
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileExtension = (filename) => {
    const parts = filename.split(".");
    return parts.length > 1 ? parts.pop().toUpperCase() : "FILE";
  };

  const renderWelcome = () => (
    <main className="entry-screen">
      <div className="entry-copy">
        <div className="eyebrow">
          <span className="eyebrow-dot" />
          AUTONOMOUS SOFTWARE ENGINEERING
        </div>

        <h1>
          Software
          <br />
          <span>that builds itself.</span>
        </h1>

        <p className="entry-description">
          Agentverse turns an idea into an engineered application through a
          coordinated team of autonomous AI agents.
        </p>

        <div className="entry-actions">
          <button
            className="primary-button"
            onClick={() => {
              setAuthMode("login");
              goTo("auth");
            }}
          >
            ENTER AGENTVERSE
            <span>→</span>
          </button>

          <button
            className="secondary-button"
            onClick={() => {
              setAuthMode("signup");
              goTo("auth");
            }}
          >
            CREATE ACCOUNT
          </button>
        </div>

        <div className="entry-meta">
          <span>PLAN</span>
          <span>BUILD</span>
          <span>TEST</span>
          <span>FIX</span>
          <span>DEPLOY</span>
        </div>
      </div>

      <div className="entry-orbit-wrap">
        <div className="entry-orbit orbit-one" />
        <div className="entry-orbit orbit-two" />
        <div className="entry-orbit orbit-three" />

        <div className="entry-core">
          <span>AGENT</span>
          <strong>VERSE</strong>
          <small>01 / 06</small>
        </div>

        {agents.map((agent, index) => {
          const positions = [
            { top: "5%", left: "48%" },
            { top: "28%", left: "85%" },
            { top: "70%", left: "79%" },
            { top: "87%", left: "45%" },
            { top: "68%", left: "8%" },
            { top: "28%", left: "10%" },
          ];

          return (
            <button
              key={agent.id}
              className="entry-agent-node"
              style={positions[index]}
              onClick={() => {
                setActiveAgent(agent.id);
                goTo("workspace");
              }}
            >
              <span>{agent.number}</span>
              {agent.name}
            </button>
          );
        })}
      </div>
    </main>
  );

  const renderAuth = () => (
    <main className="auth-screen">
      <div className="auth-panel">
        <div className="auth-header">
          <span className="eyebrow">AGENTVERSE ACCESS</span>

          <h1>
            {authMode === "forgot"
              ? "Reset your access."
              : authMode === "signup"
              ? "Create your workspace."
              : "Welcome back."}
          </h1>

          <p>
            {authMode === "forgot"
              ? "Enter your email and we'll prepare a password reset link."
              : authMode === "signup"
              ? "Create your account and start building with an autonomous engineering team."
              : "Continue building with your autonomous engineering team."}
          </p>
        </div>

        {authMode === "forgot" ? (
          <form
            className="auth-form"
            onSubmit={(event) => {
              event.preventDefault();
              setShowNotification(true);
            }}
          >
            <label>
              Email
              <input
                type="email"
                placeholder="you@example.com"
                value={user.email}
                onChange={(event) =>
                  setUser((current) => ({
                    ...current,
                    email: event.target.value,
                  }))
                }
              />
            </label>

            <button className="primary-button full-width" type="submit">
              SEND RESET LINK
              <span>→</span>
            </button>

            <button
              type="button"
              className="text-button"
              onClick={() => setAuthMode("login")}
            >
              ← Back to sign in
            </button>
          </form>
        ) : (
          <form className="auth-form" onSubmit={submitLogin}>
            {authMode === "signup" && (
              <label>
                Name
                <input
                  type="text"
                  placeholder="Your name"
                  value={user.name}
                  onChange={(event) =>
                    setUser((current) => ({
                      ...current,
                      name: event.target.value,
                    }))
                  }
                />
              </label>
            )}

            <label>
              Email
              <input
                type="email"
                placeholder="you@example.com"
                value={user.email}
                onChange={(event) =>
                  setUser((current) => ({
                    ...current,
                    email: event.target.value,
                  }))
                }
              />
            </label>

            <label>
              Password
              <input
                type="password"
                placeholder="••••••••"
                value={user.password}
                onChange={(event) =>
                  setUser((current) => ({
                    ...current,
                    password: event.target.value,
                  }))
                }
              />
            </label>

            {authMode === "signup" && (
              <label>
                Confirm password
                <input
                  type="password"
                  placeholder="••••••••"
                  value={user.confirmPassword}
                  onChange={(event) =>
                    setUser((current) => ({
                      ...current,
                      confirmPassword: event.target.value,
                    }))
                  }
                />
              </label>
            )}

            {authMode === "login" && (
              <button
                type="button"
                className="forgot-link"
                onClick={() => setAuthMode("forgot")}
              >
                Forgot password?
              </button>
            )}

            <button className="primary-button full-width" type="submit">
              {authMode === "signup" ? "CREATE ACCOUNT" : "SIGN IN"}
              <span>→</span>
            </button>

            <div className="auth-divider">
              <span />
              OR
              <span />
            </div>

            <button
              type="button"
              className="google-button"
              onClick={() => setShowNotification(true)}
            >
              <span className="google-mark">G</span>
              CONTINUE WITH GOOGLE
            </button>

            <p className="auth-switch">
              {authMode === "signup"
                ? "Already have an account?"
                : "Don't have an account?"}

              <button
                type="button"
                onClick={() =>
                  setAuthMode(authMode === "signup" ? "login" : "signup")
                }
              >
                {authMode === "signup" ? "Sign in" : "Create account"}
              </button>
            </p>
          </form>
        )}
      </div>

      <div className="auth-visual">
        <div className="auth-visual-inner">
          <span className="eyebrow">ENGINEERING, REIMAGINED</span>

          <h2>
            One idea.
            <br />
            <span>Six minds.</span>
            <br />
            One result.
          </h2>

          <div className="mini-agent-stack">
            {agents.map((agent) => (
              <div key={agent.id}>
                <span>{agent.number}</span>
                {agent.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );

  const renderRoleOnboarding = () => (
    <main className="onboarding-screen">
      <div className="onboarding-header">
        <div className="onboarding-progress">
          <span className="active">01</span>
          <i />
          <span>02</span>
          <i />
          <span>03</span>
          <i />
          <span>04</span>
        </div>

        <span className="eyebrow">YOUR AGENTVERSE PROFILE</span>

        <h1>First, tell us about yourself.</h1>

        <p>
          This helps the engineering team understand how to communicate and
          shape the experience around you.
        </p>
      </div>

      <div className="option-grid role-grid">
        {roles.map((role) => (
          <button
            key={role}
            className={`selection-card ${
              profile.role === role ? "selected" : ""
            }`}
            onClick={() => handleRoleSelect(role)}
          >
            <span className="selection-index">
              {String(roles.indexOf(role) + 1).padStart(2, "0")}
            </span>

            <strong>{role}</strong>

            <span className="selection-arrow">↗</span>
          </button>
        ))}
      </div>

      <div className="onboarding-actions">
        <button
          className="secondary-button"
          onClick={() => goTo("auth")}
        >
          ← BACK
        </button>

        <button
          className="primary-button"
          disabled={!profile.role}
          onClick={() => goTo("onboarding-build")}
        >
          CONTINUE
          <span>→</span>
        </button>
      </div>
    </main>
  );

  const renderBuildOnboarding = () => (
    <main className="onboarding-screen">
      <div className="onboarding-header">
        <div className="onboarding-progress">
          <span className="done">01</span>
          <i className="done-line" />
          <span className="active">02</span>
          <i />
          <span>03</span>
          <i />
          <span>04</span>
        </div>

        <span className="eyebrow">PROJECT DIRECTION</span>

        <h1>What would you like to build?</h1>

        <p>
          Choose the closest starting point. Your agents can adapt the plan
          once they understand the actual requirement.
        </p>
      </div>

      <div className="option-grid build-grid">
        {buildTypes.map((type) => (
          <button
            key={type.id}
            className={`build-card ${
              profile.buildType === type.id ? "selected" : ""
            }`}
            onClick={() => handleBuildTypeSelect(type.id)}
          >
            <span className="build-card-icon">{type.icon}</span>

            <strong>{type.title}</strong>

            <p>{type.description}</p>

            <span className="selection-arrow">↗</span>
          </button>
        ))}
      </div>

      <div className="onboarding-actions">
        <button
          className="secondary-button"
          onClick={() => goTo("onboarding-role")}
        >
          ← BACK
        </button>

        <button
          className="primary-button"
          disabled={!profile.buildType}
          onClick={() => goTo("onboarding-idea")}
        >
          CONTINUE
          <span>→</span>
        </button>
      </div>
    </main>
  );

  const renderIdeaOnboarding = () => (
    <main className="onboarding-screen idea-screen">
      <div className="onboarding-header">
        <div className="onboarding-progress">
          <span className="done">01</span>
          <i className="done-line" />
          <span className="done">02</span>
          <i className="done-line" />
          <span className="active">03</span>
          <i />
          <span>04</span>
        </div>

        <span className="eyebrow">YOUR IDEA</span>

        <h1>Tell the team what you want to build.</h1>

        <p>
          Don't worry about technical details. Describe the outcome in your
          own words and let the agents work out the engineering path.
        </p>
      </div>

      <div className="idea-panel">
        <div className="idea-panel-top">
          <span>PROJECT REQUIREMENT</span>
          <span>{profile.buildType || "PROJECT"}</span>
        </div>

        <textarea
          value={profile.idea}
          onChange={(event) =>
            setProfile((current) => ({
              ...current,
              idea: event.target.value,
            }))
          }
          placeholder={`Example:
Build a collaborative platform where college students can
create projects, find teammates and manage tasks...`}
        />

        <div className="idea-panel-bottom">
          <span>
            {profile.idea.length} characters
          </span>

          <span>AGENTVERSE WILL PLAN THE REST</span>
        </div>
      </div>

      <div className="onboarding-actions">
        <button
          className="secondary-button"
          onClick={() => goTo("onboarding-build")}
        >
          ← BACK
        </button>

        <button
          className="primary-button"
          disabled={!profile.idea.trim()}
          onClick={() => goTo("onboarding-files")}
        >
          CONTINUE
          <span>→</span>
        </button>
      </div>
    </main>
  );

  const renderFileOnboarding = () => (
    <main className="onboarding-screen files-screen">
      <div className="onboarding-header">
        <div className="onboarding-progress">
          <span className="done">01</span>
          <i className="done-line" />
          <span className="done">02</span>
          <i className="done-line" />
          <span className="done">03</span>
          <i className="done-line" />
          <span className="active">04</span>
        </div>

        <span className="eyebrow">PROJECT CONTEXT</span>

        <h1>Give your agents more context.</h1>

        <p>
          Add requirements, designs, documents, images or existing project
          files. You can also skip this step.
        </p>
      </div>

      <div
        className={`upload-zone ${dragging ? "dragging" : ""}`}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
      >
        <div className="upload-symbol">＋</div>

        <h2>Drop files here</h2>

        <p>or choose files directly from your device</p>

        <div className="upload-actions">
          <button
            className="secondary-button"
            onClick={() => fileInputRef.current?.click()}
          >
            📎 ADD FILES
          </button>

          <button
            className="secondary-button"
            onClick={() => imageInputRef.current?.click()}
          >
            ◉ ADD IMAGES
          </button>
        </div>

        <span className="upload-note">
          PDFs · Documents · Images · Code · ZIP files
        </span>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          hidden
          onChange={(event) => handleFiles(event.target.files)}
        />

        <input
          ref={imageInputRef}
          type="file"
          multiple
          accept="image/*"
          hidden
          onChange={(event) => handleFiles(event.target.files)}
        />
      </div>

      {files.length > 0 && (
        <div className="file-list">
          <div className="file-list-header">
            <span>ATTACHED CONTEXT</span>
            <span>{files.length} FILE(S)</span>
          </div>

          {files.map((file, index) => (
            <div className="file-row" key={`${file.name}-${index}`}>
              <div className="file-type">
                {getFileExtension(file.name)}
              </div>

              <div className="file-information">
                <strong>{file.name}</strong>
                <span>{formatFileSize(file.size)}</span>
              </div>

              <button
                className="remove-file"
                onClick={() => removeFile(index)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="onboarding-actions">
        <button
          className="secondary-button"
          onClick={() => goTo("onboarding-idea")}
        >
          ← BACK
        </button>

        <button
          className="primary-button"
          onClick={() => goTo("workspace")}
        >
          ENTER AGENTVERSE
          <span>→</span>
        </button>
      </div>
    </main>
  );

  const renderWorkspace = () => (
    <main className="workspace-screen">
      <section className="workspace-hero">
        <div className="workspace-hero-copy">
          <span className="eyebrow">
            AUTONOMOUS ENGINEERING WORKSPACE
          </span>

          <h1>
            Software
            <br />
            <span>that builds itself.</span>
          </h1>

          <p>
            Give the team a requirement. The orchestrator decides who should
            act, what should happen next and when the application is ready.
          </p>

          <div className="workspace-profile">
            <span>PROFILE</span>
            <strong>{profile.role || "Builder"}</strong>
            <i />
            <span>BUILD</span>
            <strong>
              {buildTypes.find((item) => item.id === profile.buildType)
                ?.title || "Application"}
            </strong>
          </div>
        </div>

        <div className="workspace-orbit">
          <div className="orbit-line orbit-line-one" />
          <div className="orbit-line orbit-line-two" />
          <div className="orbit-line orbit-line-three" />

          <div className="workspace-core">
            <small>AGENTVERSE</small>
            <strong>CORE</strong>
            <span>ACTIVE</span>
          </div>

          {agents.map((agent, index) => {
            const positions = [
              { top: "2%", left: "46%" },
              { top: "24%", left: "81%" },
              { top: "66%", left: "82%" },
              { top: "87%", left: "45%" },
              { top: "66%", left: "7%" },
              { top: "24%", left: "8%" },
            ];

            return (
              <button
                key={agent.id}
                className={`workspace-agent-node ${
                  activeAgent === agent.id ? "active" : ""
                } ${
                  buildStep >= index && running ? "progressed" : ""
                }`}
                style={positions[index]}
                onClick={() => setActiveAgent(agent.id)}
              >
                <span>{agent.number}</span>
                {agent.name}
              </button>
            );
          })}
        </div>
      </section>

      <section className="workspace-section requirement-section">
        <div className="section-heading">
          <span>01 / REQUIREMENT</span>
          <h2>Tell the team what you're building.</h2>
        </div>

        <div className="requirement-card">
          <textarea
            value={profile.idea}
            onChange={(event) =>
              setProfile((current) => ({
                ...current,
                idea: event.target.value,
              }))
            }
            placeholder="Describe your application..."
          />

          <div className="requirement-toolbar">
            <div className="requirement-tools">
              <button
                onClick={() => fileInputRef.current?.click()}
              >
                📎 ADD FILES
              </button>

              <button
                onClick={() => imageInputRef.current?.click()}
              >
                ◉ ADD IMAGES
              </button>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                hidden
                onChange={(event) => handleFiles(event.target.files)}
              />

              <input
                ref={imageInputRef}
                type="file"
                multiple
                accept="image/*"
                hidden
                onChange={(event) => handleFiles(event.target.files)}
              />
            </div>

            <button
              className="primary-button"
              onClick={startBuild}
            >
              {running ? "TEAM IS WORKING..." : "INITIALIZE TEAM"}
              <span>→</span>
            </button>
          </div>

          {files.length > 0 && (
            <div className="workspace-file-strip">
              {files.map((file, index) => (
                <div className="workspace-file" key={`${file.name}-${index}`}>
                  <span>{getFileExtension(file.name)}</span>
                  <strong>{file.name}</strong>
                  <button onClick={() => removeFile(index)}>×</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="workspace-section agents-section">
        <div className="section-heading">
          <span>02 / AGENTS</span>
          <h2>The engineering team.</h2>
        </div>

        <div className="agent-layout">
          <div className="agent-list">
            {agents.map((agent, index) => (
              <button
                key={agent.id}
                className={`agent-row ${
                  activeAgent === agent.id ? "active" : ""
                }`}
                onClick={() => setActiveAgent(agent.id)}
              >
                <span>{agent.number}</span>

                <div>
                  <strong>{agent.name}</strong>
                  <small>{agent.role}</small>
                </div>

                <span className="row-arrow">↗</span>
              </button>
            ))}
          </div>

          <div className="agent-detail">
            <span className="detail-number">
              {selectedAgent.number}
            </span>

            <span className="eyebrow">SPECIALIST AGENT</span>

            <h3>{selectedAgent.name}</h3>

            <p>{selectedAgent.description}</p>

            <div className="detail-status">
              <span />
              READY FOR ASSIGNMENT
            </div>
          </div>
        </div>
      </section>

      <section className="workspace-section live-section">
        <div className="section-heading">
          <span>03 / LIVE BUILD</span>
          <h2>Watch the team reason through the work.</h2>
        </div>

        <div className="live-build-card">
          <div className="live-header">
            <div>
              <span className="live-dot" />
              LIVE ENGINEERING ACTIVITY
            </div>

            <span>RUN {running ? "ACTIVE" : "IDLE"}</span>
          </div>

          <div className="live-agents">
            {agents.map((agent, index) => (
              <div
                key={agent.id}
                className={`live-agent ${
                  buildStep === index && running ? "current" : ""
                } ${buildStep > index ? "complete" : ""}`}
              >
                <span>{agent.number}</span>
                <strong>{agent.name}</strong>
              </div>
            ))}
          </div>

<div className="live-event">
  <span className="event-pulse" />
  {running
    ? swarmLogs[swarmLogs.length - 1] || "Connecting to swarm..."
    : "Initialize the team to begin the engineering workflow."}
</div>

{swarmLogs.length > 0 && (
  <div
    style={{
      maxHeight: "200px",
      overflowY: "auto",
      padding: "12px",
      marginTop: "12px",
      border: "1px solid var(--line)",
      borderRadius: "12px",
      fontFamily: "'DM Mono', monospace",
      fontSize: "11px",
      lineHeight: "1.6",
    }}
  >
    {swarmLogs.slice(-20).map((log, i) => (
      <div key={i} style={{ color: "var(--muted)" }}>
        <span style={{ color: "var(--gold)", marginRight: "8px" }}>›</span>
        {log}
      </div>
    ))}
  </div>
)}

{projectData?.generated_files &&
  Object.keys(projectData.generated_files).length > 0 && (
    <div style={{ marginTop: "20px" }}>
      <div
        style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: "11px",
          color: "var(--gold)",
          marginBottom: "10px",
        }}
      >
        📁 GENERATED FILES ({Object.keys(projectData.generated_files).length})
      </div>

      {Object.entries(projectData.generated_files).map(([name, content]) => (
        <div
          key={name}
          style={{
            border: "1px solid var(--line)",
            borderRadius: "12px",
            padding: "14px",
            marginBottom: "10px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "10px",
              fontFamily: "'DM Mono', monospace",
              fontSize: "11px",
            }}
          >
            <strong style={{ color: "var(--gold)" }}>{name}</strong>
            <span style={{ color: "var(--muted)" }}>
              {String(content).split("\n").length} lines
            </span>
          </div>
          <pre
            style={{
              margin: 0,
              padding: "12px",
              background: "rgba(0,0,0,0.3)",
              borderRadius: "8px",
              overflow: "auto",
              maxHeight: "300px",
              fontFamily: "'DM Mono', monospace",
              fontSize: "11px",
              color: "var(--text)",
            }}
          >
            {content}
          </pre>
        </div>
      ))}
    </div>
  )}
          <div className="telemetry">
            <div>
              <span>AGENTS</span>
              <strong>06</strong>
            </div>

            <div>
              <span>STATE</span>
              <strong>{running ? "ACTIVE" : "READY"}</strong>
            </div>

            <div>
              <span>ITERATION</span>
              <strong>{running ? buildStep + 1 : "—"}</strong>
            </div>

            <div>
              <span>CONTEXT</span>
              <strong>{files.length} FILES</strong>
            </div>
          </div>
        </div>
      </section>
    </main>
  );

  const renderScreen = () => {
    switch (screen) {
      case "auth":
        return renderAuth();

      case "onboarding-role":
        return renderRoleOnboarding();

      case "onboarding-build":
        return renderBuildOnboarding();

      case "onboarding-idea":
        return renderIdeaOnboarding();

      case "onboarding-files":
        return renderFileOnboarding();

      case "workspace":
        return renderWorkspace();

      default:
        return renderWelcome();
    }
  };

  return (
    <div className={darkMode ? "site dark" : "site light"}>
      <div className="cursor-light" />
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <div className="ambient ambient-three" />

      <div className="glitter-field">{glitters}</div>

      <header className="topbar">
        <button
          className="brand"
          onClick={() => goTo("welcome")}
        >
          <span className="brand-mark">A</span>

          <span>
            AGENT
            <strong>VERSE</strong>
          </span>
        </button>

        <nav>
          <button
            className={screen === "welcome" ? "active" : ""}
            onClick={() => goTo("welcome")}
          >
            STORY
          </button>

          <button
            className={screen === "workspace" ? "active" : ""}
            onClick={() => goTo("workspace")}
          >
            AGENTS
          </button>

          <button
            onClick={() => goTo("workspace")}
          >
            BUILD
          </button>
        </nav>

        <div className="topbar-actions">
          <button
            className="theme-toggle"
            onClick={() => setDarkMode((current) => !current)}
            aria-label="Toggle theme"
          >
            <span>{darkMode ? "☼" : "☾"}</span>
          </button>

          <button
            className="login-pill"
            onClick={() => {
              setAuthMode("login");
              goTo("auth");
            }}
          >
            {user.name || "SIGN IN"}
          </button>
        </div>
      </header>

      {renderScreen()}

      {showNotification && (
        <div className="notification">
          <span>!</span>

          <div>
            <strong>Action requires more information.</strong>
            <p>
              Complete the required fields or connect the backend
              authentication service.
            </p>
          </div>

          <button onClick={() => setShowNotification(false)}>
            ×
          </button>
        </div>
      )}

      <footer className="site-footer">
        <span>AGENTVERSE / 2026</span>
        <span>AUTONOMOUS SOFTWARE ENGINEERING</span>
        <span>TRACK ONE</span>
      </footer>
    </div>
  );
}

export default App;
