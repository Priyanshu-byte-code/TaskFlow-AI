import { Link } from 'react-router-dom';

const features = [
  {
    icon: '⚡',
    title: 'Real-time collaboration',
    desc: 'Every task update syncs instantly across your entire team via Socket.io — no refresh needed.'
  },
  {
    icon: '🤖',
    title: 'AI sprint assistant',
    desc: 'Powered by Groq LLaMA — detects sprint risks, suggests priorities, and answers questions about your project.'
  },
  {
    icon: '🔐',
    title: 'Role-based access',
    desc: 'Admin, Manager, Member roles with JWT authentication and refresh token rotation.'
  },
  {
    icon: '📊',
    title: 'Analytics dashboard',
    desc: 'Burndown charts, velocity tracking, and priority breakdowns — all in real time.'
  },
  {
    icon: '🎯',
    title: 'Kanban board',
    desc: 'Drag and drop tasks across To do, In progress, In review, and Done columns effortlessly.'
  },
  {
    icon: '🔔',
    title: 'Smart notifications',
    desc: 'Get notified instantly when tasks are assigned, updated, or commented on.'
  }
];

const stats = [
  { value: 'MERN', label: 'Full stack' },
  { value: 'AI', label: 'Powered' },
  { value: '∞', label: 'Real-time' },
  { value: '3', label: 'User roles' }
];

const LandingPage = () => {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0f',
      fontFamily: "'DM Sans', sans-serif",
      color: '#fff',
      overflowX: 'hidden'
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@700;800&display=swap" rel="stylesheet" />

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .hero-animate { animation: slide-up 0.8s ease forwards; }
        .hero-animate-delay { animation: slide-up 0.8s ease 0.2s forwards; opacity: 0; }
        .hero-animate-delay2 { animation: slide-up 0.8s ease 0.4s forwards; opacity: 0; }
        .float-card { animation: float 6s ease-in-out infinite; }
        .float-card-2 { animation: float 6s ease-in-out 2s infinite; }
        .glow-pulse { animation: pulse-glow 3s ease-in-out infinite; }
        .btn-primary {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: #fff;
          border: none;
          padding: 14px 32px;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-block;
          font-family: 'DM Sans', sans-serif;
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 20px 40px rgba(99, 102, 241, 0.4);
        }
        .btn-secondary {
          background: transparent;
          color: #fff;
          border: 1px solid rgba(255,255,255,0.2);
          padding: 14px 32px;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-block;
          font-family: 'DM Sans', sans-serif;
        }
        .btn-secondary:hover {
          background: rgba(255,255,255,0.05);
          border-color: rgba(255,255,255,0.4);
          transform: translateY(-2px);
        }
        .feature-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 28px;
          transition: all 0.3s ease;
        }
        .feature-card:hover {
          background: rgba(255,255,255,0.06);
          border-color: rgba(99,102,241,0.3);
          transform: translateY(-4px);
        }
        .nav-link {
          color: rgba(255,255,255,0.6);
          text-decoration: none;
          font-size: 14px;
          transition: color 0.2s;
        }
        .nav-link:hover { color: #fff; }
        .gradient-text {
          background: linear-gradient(135deg, #fff 0%, #a5b4fc 50%, #c084fc 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .tag-pill {
          background: rgba(99,102,241,0.15);
          border: 1px solid rgba(99,102,241,0.3);
          color: #a5b4fc;
          padding: 6px 14px;
          border-radius: 100px;
          font-size: 12px;
          font-weight: 500;
          display: inline-block;
        }
      `}</style>

      {/* Background orbs */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div className="glow-pulse" style={{
          position: 'absolute', top: '10%', left: '15%',
          width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
          filter: 'blur(40px)'
        }} />
        <div className="glow-pulse" style={{
          position: 'absolute', bottom: '20%', right: '10%',
          width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)',
          filter: 'blur(40px)', animationDelay: '1.5s'
        }} />
      </div>

      {/* Navbar */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 60px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(10,10,15,0.8)',
        backdropFilter: 'blur(20px)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 16
          }}>T</div>
          <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 18 }}>TaskFlow</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <a href="#features" className="nav-link">Features</a>
          <a href="#stack" className="nav-link">Tech stack</a>
          <a href="#stats" className="nav-link">About</a>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link to="/login" className="btn-secondary" style={{ padding: '10px 22px', fontSize: 14 }}>
            Sign in
          </Link>
          <Link to="/register" className="btn-primary" style={{ padding: '10px 22px', fontSize: 14 }}>
            Get started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        position: 'relative', zIndex: 1,
        maxWidth: 1100, margin: '0 auto',
        padding: '100px 60px 80px',
        textAlign: 'center'
      }}>
        <div className="hero-animate">
          <span className="tag-pill">AI-powered · Real-time · MERN Stack</span>
        </div>

        <h1 className="hero-animate-delay gradient-text" style={{
          fontFamily: 'Syne, sans-serif',
          fontWeight: 800,
          fontSize: 'clamp(48px, 7vw, 88px)',
          lineHeight: 1.05,
          marginTop: 24, marginBottom: 24,
          letterSpacing: '-2px'
        }}>
          Your team's sprint,<br />finally under control.
        </h1>

        <p className="hero-animate-delay2" style={{
          fontSize: 18, color: 'rgba(255,255,255,0.55)',
          maxWidth: 560, margin: '0 auto 40px',
          lineHeight: 1.7, fontWeight: 300
        }}>
          TaskFlow combines real-time collaboration, AI sprint intelligence, and role-based access into one beautifully simple project management tool.
        </p>

        <div className="hero-animate-delay2" style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/register" className="btn-primary" style={{ fontSize: 16, padding: '16px 36px' }}>
            Start for free →
          </Link>
          <Link to="/login" className="btn-secondary" style={{ fontSize: 16, padding: '16px 36px' }}>
            Sign in
          </Link>
        </div>

        {/* Floating UI preview */}
        <div style={{ position: 'relative', marginTop: 80, height: 340 }}>
          {/* Main board preview */}
          <div style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 20, padding: 20,
            maxWidth: 780, margin: '0 auto',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              {['#ff5f57','#febc2e','#28c840'].map(c => (
                <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
              ))}
              <div style={{ flex: 1, background: 'rgba(255,255,255,0.06)', borderRadius: 6, height: 10, marginLeft: 8 }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
              {[
                { col: 'To do', color: '#64748b', tasks: ['JWT auth setup', 'DB schema design'] },
                { col: 'In progress', color: '#6366f1', tasks: ['Kanban drag & drop', 'Socket.io setup'] },
                { col: 'In review', color: '#f59e0b', tasks: ['AI integration'] },
                { col: 'Done', color: '#22c55e', tasks: ['Project setup', 'Redux store'] }
              ].map(({ col, color, tasks }) => (
                <div key={col}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: color }} />
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>{col}</span>
                  </div>
                  {tasks.map(t => (
                    <div key={t} style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: 8, padding: '8px 10px', marginBottom: 6
                    }}>
                      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)', lineHeight: 1.4 }}>{t}</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                        <div style={{ width: 14, height: 14, borderRadius: '50%', background: 'rgba(99,102,241,0.4)', fontSize: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a5b4fc' }}>P</div>
                        <div style={{ fontSize: 9, color: color, fontWeight: 600 }}>high</div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Floating AI card */}
          <div className="float-card" style={{
            position: 'absolute', right: '2%', top: '10%',
            background: 'rgba(99,102,241,0.15)',
            border: '1px solid rgba(99,102,241,0.3)',
            borderRadius: 14, padding: '12px 16px',
            backdropFilter: 'blur(20px)', width: 180
          }}>
            <div style={{ fontSize: 10, color: '#a5b4fc', marginBottom: 6, fontWeight: 500 }}>AI priority alert</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)', lineHeight: 1.5 }}>JWT setup is blocking 3 downstream tasks. Assign today.</div>
          </div>

          {/* Floating notification */}
          <div className="float-card-2" style={{
            position: 'absolute', left: '2%', bottom: '15%',
            background: 'rgba(34,197,94,0.1)',
            border: '1px solid rgba(34,197,94,0.2)',
            borderRadius: 14, padding: '10px 14px',
            backdropFilter: 'blur(20px)'
          }}>
            <div style={{ fontSize: 10, color: '#4ade80', marginBottom: 2 }}>🔔 Task assigned</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>Priya → Socket.io setup</div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section id="stats" style={{
        position: 'relative', zIndex: 1,
        borderTop: '1px solid rgba(255,255,255,0.06)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '48px 60px'
      }}>
        <div style={{
          maxWidth: 1100, margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 20, textAlign: 'center'
        }}>
          {stats.map(s => (
            <div key={s.label}>
              <div style={{
                fontFamily: 'Syne, sans-serif', fontWeight: 800,
                fontSize: 40, color: '#a5b4fc', lineHeight: 1
              }}>{s.value}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 6 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{
        position: 'relative', zIndex: 1,
        maxWidth: 1100, margin: '0 auto',
        padding: '100px 60px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <span className="tag-pill">Features</span>
          <h2 style={{
            fontFamily: 'Syne, sans-serif', fontWeight: 800,
            fontSize: 'clamp(32px, 4vw, 52px)',
            marginTop: 20, marginBottom: 16,
            letterSpacing: '-1px'
          }}>Everything your team needs</h2>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 16, maxWidth: 500, margin: '0 auto' }}>
            Built with production-grade patterns that real companies use every day.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {features.map(f => (
            <div key={f.title} className="feature-card">
              <div style={{ fontSize: 28, marginBottom: 14 }}>{f.icon}</div>
              <h3 style={{ fontWeight: 600, fontSize: 16, marginBottom: 8 }}>{f.title}</h3>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tech stack */}
      <section id="stack" style={{
        position: 'relative', zIndex: 1,
        background: 'rgba(255,255,255,0.02)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '80px 60px'
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
          <span className="tag-pill">Tech stack</span>
          <h2 style={{
            fontFamily: 'Syne, sans-serif', fontWeight: 800,
            fontSize: 'clamp(28px, 3vw, 44px)',
            marginTop: 20, marginBottom: 48, letterSpacing: '-1px'
          }}>Built with modern technologies</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
            {[
              { name: 'React 18', color: '#61dafb' },
              { name: 'TypeScript', color: '#3178c6' },
              { name: 'Node.js', color: '#68a063' },
              { name: 'Express', color: '#fff' },
              { name: 'MongoDB', color: '#47a248' },
              { name: 'Socket.io', color: '#fff' },
              { name: 'Redux Toolkit', color: '#764abc' },
              { name: 'Tailwind CSS', color: '#38bdf8' },
              { name: 'JWT Auth', color: '#f59e0b' },
              { name: 'Groq AI', color: '#f97316' },
              { name: 'Recharts', color: '#22d3ee' },
              { name: 'Vite', color: '#a78bfa' },
            ].map(t => (
              <div key={t.name} style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 100, padding: '8px 18px',
                fontSize: 13, fontWeight: 500,
                color: t.color, transition: 'all 0.2s'
              }}>{t.name}</div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        position: 'relative', zIndex: 1,
        maxWidth: 700, margin: '0 auto',
        padding: '100px 60px',
        textAlign: 'center'
      }}>
        <h2 style={{
          fontFamily: 'Syne, sans-serif', fontWeight: 800,
          fontSize: 'clamp(32px, 5vw, 60px)',
          lineHeight: 1.1, marginBottom: 24,
          letterSpacing: '-1.5px'
        }}>
          Ready to ship<br />
          <span className="gradient-text">faster than ever?</span>
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 16, marginBottom: 40, lineHeight: 1.7 }}>
          Join your team on TaskFlow. Create an account in 30 seconds — no credit card required.
        </p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/register" className="btn-primary" style={{ fontSize: 16, padding: '16px 40px' }}>
            Create free account →
          </Link>
          <Link to="/login" className="btn-secondary" style={{ fontSize: 16, padding: '16px 40px' }}>
            Sign in
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        position: 'relative', zIndex: 1,
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '32px 60px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 24, height: 24, borderRadius: 7,
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Syne', fontWeight: 800, fontSize: 11
          }}>T</div>
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>TaskFlow — built with MERN stack</span>
        </div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>
          React · Node.js · MongoDB · Socket.io · Groq AI
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;