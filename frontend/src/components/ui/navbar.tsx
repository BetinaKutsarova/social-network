import React, { useState } from 'react';
import { useLogout } from '../../hooks/useLogout';
import { FaHome, FaEnvelope, FaSearch, FaUser, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { NavItem } from './navitem';
import { IoPaw } from 'react-icons/io5';

export const NavBar: React.FC = () => {
	const [activeTab, setActiveTab] = useState<string>('home');
	const { logout } = useLogout();

	return (
		<div className="sidebar">
			<div className="logo-container">
				<h1 className="logo">PetPals <IoPaw color="#8e6f4e" /></h1>
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
	);
};