import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './navbar.css';
import { useLogout } from '../../hooks/useLogout';
import { FaHome, FaEnvelope, FaSearch, FaUser, FaCog, FaSignOutAlt, FaTimes } from 'react-icons/fa';
import { NavItem } from './navitem';
import { IoPaw } from 'react-icons/io5';
import { activeTabAtom } from '../../state/atoms';
import { useAtom } from 'jotai';
import { ChatProvider } from '../../contexts/chatContext';
import ConversationList from './conversationList';
import ChatContainer from './chatContainer';

export const NavBar: React.FC = () => {
	const [activeTab, setActiveTab] = useAtom(activeTabAtom)
	const { logout } = useLogout();
	const navigate = useNavigate();
	const [showChat, setShowChat] = useState(false);

	const handleMessagesClick = () => {
    setActiveTab('messages');
    setShowChat(prev => !prev)
  };

	return (
    <>
      <div className="sidebar">
        <div className="logo-container">
          <h1 className="logo">PetPals <IoPaw color="#8e6f4e" /></h1>
          <h1 className="logo-small">PP</h1>
        </div>

        <nav className="nav-container">
          <NavItem
            icon={<FaHome size={20} />}
            label="Dashboard"
            isActive={activeTab === 'dashboard'}
            onClick={() => {
              setActiveTab('dashboard');
              navigate('/dashboard');
            }}
          />
          <NavItem
            icon={<FaSearch size={20} />}
            label="Explore"
            isActive={activeTab === 'explore'}
            onClick={() => {
              setActiveTab('explore');
              navigate('/explore');
            }}
          />
          <NavItem
            icon={<FaEnvelope size={20} />}
            label="Messages"
            isActive={activeTab === 'messages'}
            onClick={handleMessagesClick}
          />
          <NavItem
            icon={<FaUser size={20} />}
            label="Profile"
            isActive={activeTab === 'profile'}
            onClick={() => {
              setActiveTab('profile');
              navigate('/profile');
            }}
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

      {/* Chat Drawer */}
      {showChat && (
        <div className="chat-drawer">
          <ChatProvider>
            <div className="chat-drawer-header">
              <h3>Messages</h3>
              <button 
                className="chat-close-button" 
                onClick={() => setShowChat(false)}
                aria-label="Close chat"
              >
                <FaTimes size={20} />
              </button>
            </div>
            <div className="chat-drawer-body">
              <div className="chat-conversations">
                <ConversationList />
              </div>
              <div className="chat-messages">
                <ChatContainer />
              </div>
            </div>
          </ChatProvider>
        </div>
      )}
    </>
  );
};