import React, { useState } from 'react';
import './dashboard.css';
import { useLogout } from '../../hooks/useLogout';
import { FaBell, FaHome, FaEnvelope, FaSearch, FaUser, FaCog, FaSignOutAlt } from 'react-icons/fa';
import type { 
    UserData, 
    FeedItem, 
    TrendingTopic, 
    SuggestionUser, 
    NavItemProps, 
    FeedItemProps } from '../../types/dashboard.types'


export const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('home');
    const { logout } = useLogout();

  // Sample user data
  const userData: UserData = {
    name: 'Betty',
    username: '@betty',
    avatar: '/api/placeholder/80/80',
    followers: 15,
    following: 27,
    posts: 342
  };

  // Sample feed data
  const feedItems: FeedItem[] = [
    {
      id: 1,
      author: 'stickyPaws',
      username: '@stickypaws',
      avatar: '/api/placeholder/50/50',
      content: 'Just found the best treats for my dogs! Link is in my profile!',
      time: '2h ago',
      likes: 124,
      comments: 43,
      shares: 12
    },
    {
      id: 2,
      author: 'Matt',
      username: '@matt',
      avatar: '/api/placeholder/50/50',
      content: 'Beautiful day for hiking with my good boys! #NatureLovers #Weekend',
      time: '4h ago',
      likes: 287,
      comments: 32,
      shares: 8
    },
    {
      id: 3,
      author: 'LillyMeow',
      username: '@lillymeow',
      avatar: '/api/placeholder/50/50',
      content: 'My cat is throwing up all of the new grass I gave her! What should I do???',
      time: '5h ago',
      likes: 532,
      comments: 97,
      shares: 215
    }
  ];

  // Sample trending topics
  const trendingTopics: TrendingTopic[] = [
    { id: 1, name: '#buffyDuffy', posts: '24.5K' },
    { id: 2, name: '#daddylonglegs', posts: '18.2K' },
    { id: 3, name: '#strangerDanger', posts: '12.7K' },
    { id: 4, name: '#BigWoof', posts: '10.3K' }
  ];

  // Sample suggestions
  const suggestions: SuggestionUser[] = [
    { id: 1, name: 'BigWoof', username: '@bigwoof', avatar: '/api/placeholder/40/40' },
    { id: 2, name: 'Emma', username: '@emma', avatar: '/api/placeholder/40/40' },
    { id: 3, name: 'Retriever2030', username: '@retriever2030', avatar: '/api/placeholder/40/40' }
  ];

  return (
    <>
      <div className="dashboard-container">
        {/* Left Sidebar - Navigation */}
        <div className="sidebar">
          <div className="logo-container">
            <h1 className="logo">PetPals</h1>
            <h1 className="logo-small">PP</h1>
          </div>
          
          <nav className="nav-container">
            <NavItem 
              icon={<FaHome size={20} />} 
              label="Home" 
              isActive={activeTab === 'home'} 
              onClick={() => setActiveTab('home')}
            />
            <NavItem 
              icon={<FaSearch size={20} />} 
              label="Explore" 
              isActive={activeTab === 'explore'} 
              onClick={() => setActiveTab('explore')}
            />
            <NavItem 
              icon={<FaBell size={20} />} 
              label="Notifications" 
              isActive={activeTab === 'notifications'} 
              onClick={() => setActiveTab('notifications')}
            />
            <NavItem 
              icon={<FaEnvelope size={20} />} 
              label="Messages" 
              isActive={activeTab === 'messages'} 
              onClick={() => setActiveTab('messages')}
            />
            <NavItem 
              icon={<FaUser size={20} />} 
              label="Profile" 
              isActive={activeTab === 'profile'} 
              onClick={() => setActiveTab('profile')}
            />
            <NavItem 
              icon={<FaCog size={20} />} 
              label="Settings" 
              isActive={activeTab === 'settings'} 
              onClick={() => setActiveTab('settings')}
            />
          </nav>
          
          <div className="logout-container">
            <button 
              onClick={logout}
              className="logout-button"
            >
              <FaSignOutAlt size={20} />
              <span className="logout-text">Logout</span>
            </button>
          </div>
        </div>
        
        {/* Main Content Area */}
        <div className="main-content">
          {/* Feed */}
          <div className="feed">
            {/* Create Post Card */}
            <div className="post-creator">
              <div className="post-input-container">
                <img src={userData.avatar} alt="Your avatar" className="avatar" width="40" height="40" />
                <div className="post-input-wrapper">
                  <textarea 
                    className="post-textarea"
                    placeholder="What's barking?"
                  ></textarea>
                  <div className="post-actions">
                    <div className="post-options">
                      <button className="post-option-button">
                        Photo
                      </button>
                      <button className="post-option-button">
                        Video
                      </button>
                      <button className="post-option-button">
                        Poll
                      </button>
                    </div>
                    <button className="post-button">
                      Post
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Feed Items */}
            <div className="feed-items">
              {feedItems.map(item => (
                <FeedItem key={item.id} item={item} />
              ))}
            </div>
          </div>
          
          {/* Right Sidebar */}
          <div className="right-sidebar">
            {/* User Profile Card */}
            <div className="profile-card">
              <div className="profile-header">
                <img src={userData.avatar} alt="Profile" className="avatar" width="64" height="64" />
                <div>
                  <h3 className="profile-name">{userData.name}</h3>
                  <p className="profile-username">{userData.username}</p>
                </div>
              </div>
              <div className="profile-stats">
                <div className="profile-stat">
                  <p className="profile-stat-value">{userData.posts}</p>
                  <p className="profile-stat-label">Posts</p>
                </div>
                <div className="profile-stat">
                  <p className="profile-stat-value">{userData.followers}</p>
                  <p className="profile-stat-label">Followers</p>
                </div>
                <div className="profile-stat">
                  <p className="profile-stat-value">{userData.following}</p>
                  <p className="profile-stat-label">Following</p>
                </div>
              </div>
            </div>
            
            {/* Trending Topics */}
            <div className="trending-card">
              <h3 className="sidebar-card-title">Trending Topics</h3>
              <ul className="trending-list">
                {trendingTopics.map(topic => (
                  <li key={topic.id} className="trending-item">
                    <a href="#" style={{ textDecoration: 'none' }}>
                      <p className="trending-name">{topic.name}</p>
                      <p className="trending-posts">{topic.posts} posts</p>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Suggested Connections */}
            <div className="suggestions-card">
              <h3 className="sidebar-card-title">Suggested For You</h3>
              <ul className="suggestions-list">
                {suggestions.map(user => (
                  <li key={user.id} className="suggestion-item">
                    <div className="suggestion-user">
                      <img src={user.avatar} alt={user.name} className="avatar" width="40" height="40" />
                      <div className="suggestion-info">
                        <p className="suggestion-name">{user.name}</p>
                        <p className="suggestion-username">{user.username}</p>
                      </div>
                    </div>
                    <button className="follow-button">
                      Follow
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const NavItem: React.FC<NavItemProps> = ({ icon, label, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`nav-item ${isActive ? 'active' : ''}`}
    >
      {icon}
      <span className="nav-label">{label}</span>
    </button>
  );
};

const FeedItem: React.FC<FeedItemProps> = ({ item }) => {
  return (
    <div className="feed-item">
      <div className="feed-item-header">
        <img src={item.avatar} alt={item.author} className="avatar" width="40" height="40" />
        <div className="feed-item-user-info">
          <div className="feed-item-meta">
            <h4 className="feed-item-author">{item.author}</h4>
            <span className="feed-item-username">{item.username}</span>
            <span className="feed-item-time">·</span>
            <span className="feed-item-time">{item.time}</span>
          </div>
          <p className="feed-item-content">{item.content}</p>
          <div className="feed-item-actions">
            <div className="feed-item-action">
              <span>❤️</span> {item.likes}
            </div>
            <div className="feed-item-action">
              <span>💬</span> {item.comments}
            </div>
            <div className="feed-item-action">
              <span>↗️</span> {item.shares}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;