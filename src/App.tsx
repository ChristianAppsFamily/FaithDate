import {
  Bell,
  CalendarHeart,
  Check,
  Church,
  Heart,
  HeartHandshake,
  Home,
  MapPin,
  MessageCircle,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Star,
  User,
} from 'lucide-react';
import { useState } from 'react';

import './styles.css';

const matches = [
  {
    name: 'Sophia',
    age: 29,
    city: 'Austin, TX',
    faith: 'Worship leader',
    score: '96%',
    gradient: 'linear-gradient(150deg, #fbe2d1 0%, #d96e88 100%)',
    quote: 'I am praying for a relationship rooted in patience, honesty, and joyful service.',
  },
  {
    name: 'Grace',
    age: 27,
    city: 'Dallas, TX',
    faith: 'Bible study host',
    score: '91%',
    gradient: 'linear-gradient(150deg, #f9d7e7 0%, #9566b8 100%)',
    quote: 'I love building community around Scripture, laughter, and shared Sunday rhythms.',
  },
  {
    name: 'Naomi',
    age: 31,
    city: 'Houston, TX',
    faith: 'Mission volunteer',
    score: '89%',
    gradient: 'linear-gradient(150deg, #fee5b6 0%, #ce7a5a 100%)',
    quote: 'Serving others keeps my heart grounded, and I hope to share that calling.',
  },
];

const faithFilters = ['Shared values', 'Church attendance', 'Prayer life', 'Family goals'];

const messages = [
  {
    name: 'Sophia',
    text: 'I loved your answer about serving together. Coffee after Sunday service?',
    time: '8m',
  },
  {
    name: 'Grace',
    text: 'That devotional recommendation was exactly what I needed.',
    time: '1h',
  },
];

type Match = (typeof matches)[number];

function MatchCard({ match, onNext }: { match: Match; onNext: () => void }) {
  return (
    <article className="match-card" aria-label={`${match.name} profile preview`}>
      <div className="photo-panel" style={{ background: match.gradient }}>
        <div className="top-badge">
          <Sparkles size={16} />
          {match.score} aligned
        </div>
        <button className="top-action" aria-label="Next match" onClick={onNext}>
          <Search size={20} />
        </button>
        <div className="profile-silhouette" />
      </div>

      <div className="match-content">
        <div>
          <p className="eyebrow">Today's match</p>
          <h2>
            {match.name}, {match.age}
          </h2>
          <p className="muted">
            <MapPin size={16} />
            {match.city}
          </p>
        </div>
        <p className="bio">
          Loves worship nights, slow mornings, and building a Christ-centered home with someone
          intentional.
        </p>
        <div className="tags">
          <span>{match.faith}</span>
          <span>Serves weekly</span>
          <span>Wants family</span>
        </div>
        <div className="actions">
          <button className="round-button secondary" aria-label="Browse matches">
            <Search size={22} />
          </button>
          <button className="round-button primary" aria-label="Like profile">
            <Heart size={26} fill="currentColor" />
          </button>
          <button className="round-button secondary" aria-label="Send message">
            <MessageCircle size={22} />
          </button>
        </div>
      </div>
    </article>
  );
}

function FaithPreferences() {
  return (
    <section className="panel preferences" aria-labelledby="preferences-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Faith first</p>
          <h2 id="preferences-title">Set your spiritual priorities</h2>
        </div>
        <button className="icon-button" aria-label="Open preferences">
          <SlidersHorizontal size={20} />
        </button>
      </div>

      <div className="filter-grid">
        {faithFilters.map((filter) => (
          <button key={filter} className="filter-pill">
            <Check size={16} />
            {filter}
          </button>
        ))}
      </div>

      <div className="values-card">
        <Church size={28} />
        <div>
          <strong>Weekly church rhythm</strong>
          <span>Prioritize matches who worship and serve consistently.</span>
        </div>
      </div>
    </section>
  );
}

function MessagesPreview() {
  return (
    <section className="panel messages" aria-labelledby="messages-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Conversations</p>
          <h2 id="messages-title">Start with intention</h2>
        </div>
        <span className="notification-dot">2</span>
      </div>
      <div className="message-list">
        {messages.map((message) => (
          <article key={message.name} className="message-item">
            <div className="avatar">{message.name[0]}</div>
            <div>
              <div className="message-meta">
                <strong>{message.name}</strong>
                <span>{message.time}</span>
              </div>
              <p>{message.text}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ProfileDetail({ match }: { match: Match }) {
  return (
    <section className="phone-screen profile-detail" aria-label="Profile detail preview">
      <div className="detail-hero" style={{ background: match.gradient }}>
        <button className="icon-button light" aria-label="Back to discovery">
          <Home size={18} />
        </button>
        <span className="top-badge light">
          <ShieldCheck size={15} />
          Verified
        </span>
      </div>
      <div className="detail-body">
        <p className="eyebrow">Compatibility</p>
        <h2>{match.name} shares 7 of your top values</h2>
        <div className="compatibility">
          <span>
            <Star size={16} fill="currentColor" />
            Prayer
          </span>
          <span>
            <CalendarHeart size={16} />
            Marriage minded
          </span>
          <span>
            <HeartHandshake size={16} />
            Service
          </span>
        </div>
        <blockquote>"{match.quote}"</blockquote>
      </div>
    </section>
  );
}

function App() {
  const [matchIndex, setMatchIndex] = useState(0);
  const activeMatch = matches[matchIndex];

  function showNextMatch() {
    setMatchIndex((currentIndex) => (currentIndex + 1) % matches.length);
  }

  return (
    <main>
      <section className="hero">
        <nav className="nav" aria-label="Primary navigation">
          <a className="brand" href="/">
            <span>
              <HeartHandshake size={24} />
            </span>
            FaithDate
          </a>
          <div className="nav-actions">
            <a href="#matches">Matches</a>
            <a href="#messages">Messages</a>
            <button>Join waitlist</button>
          </div>
        </nav>

        <div className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Faith-based dating app</p>
            <h1>Meet someone who shares your walk with God.</h1>
            <p>
              FaithDate brings intentional discovery, values-led matching, and meaningful
              conversations into one calm mobile experience.
            </p>
            <div className="cta-row">
              <button className="cta-primary">Create your profile</button>
              <button className="cta-secondary">Explore matches</button>
            </div>
            <div className="trust-row" aria-label="Trust highlights">
              <span>
                <ShieldCheck size={18} />
                Verified profiles
              </span>
              <span>
                <Church size={18} />
                Faith filters
              </span>
            </div>
          </div>

          <div className="phone-shell" id="matches">
            <div className="phone-screen">
              <header className="app-header">
                <div>
                  <p className="eyebrow">Good morning</p>
                  <strong>Daniel</strong>
                </div>
                <button className="icon-button" aria-label="Notifications">
                  <Bell size={20} />
                </button>
              </header>
              <MatchCard match={activeMatch} onNext={showNextMatch} />
              <nav className="tab-bar" aria-label="App tabs">
                <Home />
                <Heart />
                <MessageCircle />
                <User />
              </nav>
            </div>
          </div>
        </div>
      </section>

      <section className="content-grid">
        <FaithPreferences />
        <ProfileDetail match={activeMatch} />
        <MessagesPreview />
      </section>
    </main>
  );
}

export default App;
