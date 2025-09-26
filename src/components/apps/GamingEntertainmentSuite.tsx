import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
// Firebase imports for future use
// import { db } from '../../lib/firebase';
// import { 
//   collection, 
//   addDoc, 
//   query, 
//   where, 
//   onSnapshot, 
//   serverTimestamp,
//   doc,
//   updateDoc,
//   deleteDoc,
//   orderBy
// } from 'firebase/firestore';

interface Game {
  id: string;
  title: string;
  genre: string;
  platform: string;
  rating: number;
  releaseDate: string;
  description: string;
  image: string;
  price: number;
  isOnSale: boolean;
  discountPercentage?: number;
  aiRecommendation: {
    score: number;
    reasons: string[];
    personalized: boolean;
  };
  features: string[];
  systemRequirements: {
    minimum: string[];
    recommended: string[];
  };
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  points: number;
  category: 'gaming' | 'social' | 'streaming' | 'collection';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlocked: boolean;
  unlockedAt?: Date;
  progress: number;
  maxProgress: number;
}

interface Stream {
  id: string;
  title: string;
  streamer: string;
  platform: 'twitch' | 'youtube' | 'facebook';
  viewers: number;
  game: string;
  thumbnail: string;
  isLive: boolean;
  startedAt: Date;
  duration: string;
}

interface GamingSession {
  id: string;
  gameId: string;
  gameTitle: string;
  startTime: Date;
  endTime?: Date;
  duration: number;
  achievements: string[];
  notes: string;
  rating?: number;
}

export const GamingEntertainmentSuite: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'games' | 'streams' | 'achievements' | 'sessions'
  >('dashboard');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [userAchievements, setUserAchievements] = useState<Achievement[]>([]);
  const [gamingSessions, setGamingSessions] = useState<GamingSession[]>([]);

  // Mock data for demonstration
  const mockGames: Game[] = [
    {
      id: '1',
      title: 'Cyberpunk 2077',
      genre: 'RPG',
      platform: 'PC',
      rating: 4.2,
      releaseDate: '2020-12-10',
      description: 'An open-world action-adventure story set in the megalopolis of Night City',
      image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800',
      price: 59.99,
      isOnSale: true,
      discountPercentage: 30,
      aiRecommendation: {
        score: 92,
        reasons: [
          'Matches your RPG preferences',
          'High-quality graphics',
          'Rich storyline',
        ],
        personalized: true,
      },
      features: ['Single Player', 'Multiplayer', 'VR Support', 'Mod Support'],
      systemRequirements: {
        minimum: ['Windows 10', 'Intel i5-3570K', '8GB RAM', 'GTX 780'],
        recommended: ['Windows 10', 'Intel i7-4790', '16GB RAM', 'RTX 2060'],
      },
    },
    {
      id: '2',
      title: 'The Witcher 3: Wild Hunt',
      genre: 'RPG',
      platform: 'PC',
      rating: 4.8,
      releaseDate: '2015-05-19',
      description: 'A story-driven open world RPG set in a fantasy universe',
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800',
      price: 29.99,
      isOnSale: false,
      aiRecommendation: {
        score: 95,
        reasons: [
          'Perfect for RPG lovers',
          'Award-winning story',
          'Massive open world',
        ],
        personalized: true,
      },
      features: ['Single Player', 'DLC Content', 'Mod Support'],
      systemRequirements: {
        minimum: ['Windows 7', 'Intel i5-2500K', '6GB RAM', 'GTX 660'],
        recommended: ['Windows 10', 'Intel i7-3770', '8GB RAM', 'GTX 770'],
      },
    },
    {
      id: '3',
      title: 'Valorant',
      genre: 'FPS',
      platform: 'PC',
      rating: 4.5,
      releaseDate: '2020-06-02',
      description: 'A 5v5 character-based tactical FPS',
      image: 'https://images.unsplash.com/photo-1556438064-2d7646166914?w=800',
      price: 0,
      isOnSale: false,
      aiRecommendation: {
        score: 88,
        reasons: ['Free-to-play', 'Competitive gameplay', 'Regular updates'],
        personalized: true,
      },
      features: ['Multiplayer', 'Competitive', 'Free-to-Play'],
      systemRequirements: {
        minimum: ['Windows 7', 'Intel Core 2 Duo', '4GB RAM', 'Intel HD 3000'],
        recommended: ['Windows 10', 'Intel i3-4150', '4GB RAM', 'GTX 730'],
      },
    }
  ];

  const mockAchievements: Achievement[] = [
    {
      id: '1',
      title: 'First Steps',
      description: 'Complete your first gaming session',
      icon: '🎮',
      points: 10,
      category: 'gaming',
      rarity: 'common',
      unlocked: true,
      unlockedAt: new Date('2024-01-15'),
      progress: 1,
      maxProgress: 1,
    },
    {
      id: '2',
      title: 'Stream Master',
      description: 'Watch 100 hours of streams',
      icon: '📺',
      points: 50,
      category: 'streaming',
      rarity: 'rare',
      unlocked: false,
      progress: 45,
      maxProgress: 100,
    },
    {
      id: '3',
      title: 'Social Butterfly',
      description: 'Join 10 gaming communities',
      icon: '🦋',
      points: 25,
      category: 'social',
      rarity: 'common',
      unlocked: false,
      progress: 3,
      maxProgress: 10,
    },
    {
      id: '4',
      title: 'Legendary Gamer',
      description: 'Achieve 1000 total gaming hours',
      icon: '👑',
      points: 100,
      category: 'gaming',
      rarity: 'legendary',
      unlocked: false,
      progress: 234,
      maxProgress: 1000,
    }
  ];

  const mockStreams: Stream[] = [
    {
      id: '1',
      title: 'Epic Gaming Session - Cyberpunk 2077',
      streamer: 'ProGamer123',
      platform: 'twitch',
      viewers: 15420,
      game: 'Cyberpunk 2077',
      thumbnail: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400',
      isLive: true,
      startedAt: new Date('2024-01-25T14:00:00'),
      duration: '2h 30m',
    },
    {
      id: '2',
      title: 'Speedrun Challenge - The Witcher 3',
      streamer: 'SpeedRunner99',
      platform: 'youtube',
      viewers: 8930,
      game: 'The Witcher 3: Wild Hunt',
      thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400',
      isLive: true,
      startedAt: new Date('2024-01-25T16:00:00'),
      duration: '1h 45m',
    }
  ];

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        setUserAchievements(mockAchievements);
        setGamingSessions([]);
        setLoading(false);
      } catch (error) {
        console.error('Error loading gaming data:', error);
        setLoading(false);
      }
    };

    loadData();
  }, [user, mockAchievements]);

  const getFilteredGames = (): Game[] => {
    return mockGames.filter(game =>
      game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.genre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.platform.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  // const getRarityColor = (rarity: string): string => {
  //   const colors = {
  //     common: '#6B7280',
  //     rare: '#3B82F6',
  //     epic: '#8B5CF6',
  //     legendary: '#F59E0B',
  //   };
  //   return colors[rarity as keyof typeof colors] || '#6B7280';
  // };

  const getRarityIcon = (rarity: string): string => {
    const icons = {
      common: '⚪',
      rare: '🔵',
      epic: '🟣',
      legendary: '🟡',
    };
    return icons[rarity as keyof typeof icons] || '⚪';
  };

  const formatPrice = (price: number): string => {
    if (price === 0) return 'Free';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const formatViewers = (viewers: number): string => {
    if (viewers >= 1000) {
      return `${(viewers / 1000).toFixed(1)}K`;
    }
    return viewers.toString();
  };

  const startGamingSession = (game: Game) => {
    const session: GamingSession = {
      id: Date.now().toString(),
      gameId: game.id,
      gameTitle: game.title,
      startTime: new Date(),
      duration: 0,
      achievements: [],
      notes: ''
    };
    setGamingSessions([...gamingSessions, session]);
  };

  const endGamingSession = (sessionId: string) => {
    setGamingSessions(sessions =>
      sessions.map(session =>
        session.id === sessionId
          ? {
              ...session,
              endTime: new Date(),
              duration: Date.now() - session.startTime.getTime(),
            }
          : session
      )
    );
  };

  if (loading) {
    return (
      <div className="gaming-entertainment-suite">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading Gaming Suite...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="gaming-entertainment-suite">
        <div className="auth-required">
          <h2>🔐 Authentication Required</h2>
          <p>Please sign in to access Gaming Suite</p>
        </div>
      </div>
    );
  }

  return (
    <div className="gaming-entertainment-suite">
      {/* Header */}
      <div className="gaming-header">
        <div className="header-left">
          <h2>🎮 Gaming & Entertainment Suite</h2>
          <p>AI-powered gaming recommendations and entertainment hub</p>
        </div>
        <div className="header-right">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search games, streams..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            <span className="search-icon">🔍</span>
          </div>
          <div className="user-stats">
            <div className="stat-item">
              <span className="stat-icon">🏆</span>
              <span className="stat-value">{userAchievements.filter(a => a.unlocked).length}</span>
              <span className="stat-label">Achievements</span>
            </div>
            <div className="stat-item">
              <span className="stat-icon">⏱️</span>
              <span className="stat-value">{gamingSessions.reduce((total, session) => total + session.duration, 0)}</span>
              <span className="stat-label">Hours Played</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="gaming-tabs">
        <button
          className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          📊 Dashboard
        </button>
        <button
          className={`tab-btn ${activeTab === 'games' ? 'active' : ''}`}
          onClick={() => setActiveTab('games')}
        >
          🎮 Games
        </button>
        <button
          className={`tab-btn ${activeTab === 'streams' ? 'active' : ''}`}
          onClick={() => setActiveTab('streams')}
        >
          📺 Streams
        </button>
        <button
          className={`tab-btn ${activeTab === 'achievements' ? 'active' : ''}`}
          onClick={() => setActiveTab('achievements')}
        >
          🏆 Achievements
        </button>
        <button
          className={`tab-btn ${activeTab === 'sessions' ? 'active' : ''}`}
          onClick={() => setActiveTab('sessions')}
        >
          📈 Sessions
        </button>
      </div>

      {/* Content */}
      <div className="gaming-content">
        {activeTab === 'dashboard' && (
          <div className="dashboard-tab">
            {/* AI Recommendations */}
            <div className="ai-recommendations">
              <h3>🤖 AI Game Recommendations</h3>
              <div className="recommendations-grid">
                {mockGames.slice(0, 3).map(game => (
                  <div key={game.id} className="recommendation-card">
                    <div className="game-image">
                      <img src={game.image} alt={game.title} />
                      <div className="ai-score">
                        {game.aiRecommendation.score}% Match
                      </div>
                    </div>
                    <div className="game-info">
                      <h4>{game.title}</h4>
                      <p className="game-genre">{game.genre} • {game.platform}</p>
                      <div className="game-rating">
                        ⭐ {game.rating}/5
                      </div>
                      <div className="game-price">
                        {game.isOnSale ? (
                          <div className="sale-price">
                            <span className="original-price">{formatPrice(game.price)}</span>
                            <span className="discounted-price">
                              {formatPrice(game.price * (1 - (game.discountPercentage || 0) / 100))}
                            </span>
                            <span className="discount-badge">-{game.discountPercentage}%</span>
                          </div>
                        ) : (
                          <span className="price">{formatPrice(game.price)}</span>
                        )}
                      </div>
                      <div className="ai-reasons">
                        {game.aiRecommendation.reasons.map((reason, index) => (
                          <span key={index} className="reason-tag">{reason}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Streams */}
            <div className="live-streams">
              <h3>📺 Live Streams</h3>
              <div className="streams-grid">
                {mockStreams.map(stream => (
                  <div key={stream.id} className="stream-card">
                    <div className="stream-thumbnail">
                      <img src={stream.thumbnail} alt={stream.title} />
                      <div className="live-indicator">LIVE</div>
                      <div className="viewer-count">
                        👥 {formatViewers(stream.viewers)}
                      </div>
                    </div>
                    <div className="stream-info">
                      <h4>{stream.title}</h4>
                      <p className="streamer">{stream.streamer}</p>
                      <p className="game">{stream.game}</p>
                      <div className="stream-platform">
                        <span className={`platform-badge ${stream.platform}`}>
                          {stream.platform === 'twitch' ? '📺 Twitch' : '📺 YouTube'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="quick-stats">
              <div className="stat-card">
                <div className="stat-icon">🎮</div>
                <div className="stat-content">
                  <h4>Games Played</h4>
                  <span className="stat-value">{gamingSessions.length}</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🏆</div>
                <div className="stat-content">
                  <h4>Achievements</h4>
                  <span className="stat-value">{userAchievements.filter(a => a.unlocked).length}</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">⏱️</div>
                <div className="stat-content">
                  <h4>Total Hours</h4>
                  <span className="stat-value">
                    {Math.round(gamingSessions.reduce((total, session) => total + session.duration, 0) / (1000 * 60 * 60))}
                  </span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📺</div>
                <div className="stat-content">
                  <h4>Streams Watched</h4>
                  <span className="stat-value">12</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'games' && (
          <div className="games-tab">
            <div className="games-header">
              <h3>🎮 Game Library</h3>
              <div className="filter-controls">
                <select title="Filter by genre">
                  <option value="all">All Genres</option>
                  <option value="RPG">RPG</option>
                  <option value="FPS">FPS</option>
                  <option value="Strategy">Strategy</option>
                  <option value="Action">Action</option>
                </select>
                <select title="Filter by platform">
                  <option value="all">All Platforms</option>
                  <option value="PC">PC</option>
                  <option value="PlayStation">PlayStation</option>
                  <option value="Xbox">Xbox</option>
                  <option value="Nintendo">Nintendo</option>
                </select>
              </div>
            </div>
            <div className="games-grid">
              {getFilteredGames().map(game => (
                <div key={game.id} className="game-card">
                  <div className="game-image">
                    <img src={game.image} alt={game.title} />
                    {game.isOnSale && (
                      <div className="sale-badge">SALE</div>
                    )}
                    <div className="game-overlay">
                      <button 
                        className="play-btn"
                        onClick={() => startGamingSession(game)}
                      >
                        ▶️ Play
                      </button>
                    </div>
                  </div>
                  <div className="game-info">
                    <h4>{game.title}</h4>
                    <p className="game-description">{game.description}</p>
                    <div className="game-meta">
                      <span className="genre">{game.genre}</span>
                      <span className="platform">{game.platform}</span>
                      <span className="rating">⭐ {game.rating}</span>
                    </div>
                    <div className="game-price">
                      {game.isOnSale ? (
                        <div className="sale-price">
                          <span className="original-price">{formatPrice(game.price)}</span>
                          <span className="discounted-price">
                            {formatPrice(game.price * (1 - (game.discountPercentage || 0) / 100))}
                          </span>
                        </div>
                      ) : (
                        <span className="price">{formatPrice(game.price)}</span>
                      )}
                    </div>
                    <div className="ai-recommendation">
                      <span className="ai-score">{game.aiRecommendation.score}% Match</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'streams' && (
          <div className="streams-tab">
            <div className="streams-header">
              <h3>📺 Live Streams</h3>
              <div className="platform-filters">
                <button className="platform-btn active">All</button>
                <button className="platform-btn">Twitch</button>
                <button className="platform-btn">YouTube</button>
                <button className="platform-btn">Facebook</button>
              </div>
            </div>
            <div className="streams-list">
              {mockStreams.map(stream => (
                <div key={stream.id} className="stream-item">
                  <div className="stream-thumbnail">
                    <img src={stream.thumbnail} alt={stream.title} />
                    <div className="live-indicator">LIVE</div>
                    <div className="viewer-count">
                      👥 {formatViewers(stream.viewers)}
                    </div>
                  </div>
                  <div className="stream-details">
                    <h4>{stream.title}</h4>
                    <p className="streamer">by {stream.streamer}</p>
                    <p className="game">Playing: {stream.game}</p>
                    <div className="stream-meta">
                      <span className="platform">{stream.platform}</span>
                      <span className="duration">{stream.duration}</span>
                    </div>
                  </div>
                  <div className="stream-actions">
                    <button className="watch-btn">Watch</button>
                    <button className="follow-btn">Follow</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="achievements-tab">
            <div className="achievements-header">
              <h3>🏆 Achievements</h3>
              <div className="achievement-stats">
                <div className="stat">
                  <span className="stat-value">{userAchievements.filter(a => a.unlocked).length}</span>
                  <span className="stat-label">Unlocked</span>
                </div>
                <div className="stat">
                  <span className="stat-value">{userAchievements.reduce((total, a) => total + (a.unlocked ? a.points : 0), 0)}</span>
                  <span className="stat-label">Points</span>
                </div>
              </div>
            </div>
            <div className="achievements-grid">
              {userAchievements.map(achievement => (
                <div key={achievement.id} className={`achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}`}>
                  <div className="achievement-icon">
                    <span className="icon">{achievement.icon}</span>
                    <div className={`rarity-indicator ${achievement.rarity}`}>
                      {getRarityIcon(achievement.rarity)}
                    </div>
                  </div>
                  <div className="achievement-info">
                    <h4>{achievement.title}</h4>
                    <p>{achievement.description}</p>
                    <div className="achievement-meta">
                      <span className="points">{achievement.points} pts</span>
                      <span className="category">{achievement.category}</span>
                    </div>
                    {!achievement.unlocked && (
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{
                            width: `${(achievement.progress / achievement.maxProgress) * 100}%`,
                          }}
                        ></div>
                        <span className="progress-text">
                          {achievement.progress}/{achievement.maxProgress}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'sessions' && (
          <div className="sessions-tab">
            <div className="sessions-header">
              <h3>📈 Gaming Sessions</h3>
              <button className="new-session-btn">+ New Session</button>
            </div>
            <div className="sessions-list">
              {gamingSessions.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">🎮</div>
                  <h4>No Gaming Sessions Yet</h4>
                  <p>Start playing games to track your sessions</p>
                  <button className="start-playing-btn">Start Playing</button>
                </div>
              ) : (
                gamingSessions.map(session => (
                  <div key={session.id} className="session-card">
                    <div className="session-info">
                      <h4>{session.gameTitle}</h4>
                      <p>Started: {session.startTime.toLocaleString()}</p>
                      {session.endTime && (
                        <p>Duration: {Math.round(session.duration / (1000 * 60))} minutes</p>
                      )}
                    </div>
                    <div className="session-actions">
                      {!session.endTime ? (
                        <button 
                          className="end-session-btn"
                          onClick={() => endGamingSession(session.id)}
                        >
                          End Session
                        </button>
                      ) : (
                        <span className="completed-badge">Completed</span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
