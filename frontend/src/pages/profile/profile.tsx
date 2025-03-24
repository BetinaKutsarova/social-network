import React, { useState } from 'react';
import './profile.css';
import { FaEdit, FaCamera } from 'react-icons/fa';
import { NavBar } from '../../components/ui/navbar';
import type {
	UserData,
	PetData,
} from '../../interfaces/profile';
import { FeedItemType } from '../../interfaces/dashboard';
import { FeedItem } from '../../components/ui/feedItem';

export const Profile: React.FC = () => {
	const [activeSection, setActiveSection] = useState<string>('posts');

	// Sample user data
	const userData: UserData = {
		name: 'Betty',
		username: '@betty',
		bio: 'Dog lover, cat enthusiast, and small animal advocate. Looking to connect with other pet lovers!',
		location: 'San Francisco, CA',
		website: 'www.bettypets.com',
		joinDate: 'Joined March 2023',
		avatar: '/api/placeholder/150/150',
		coverPhoto: '/api/placeholder/800/200',
		followers: 15,
		following: 27,
		posts: 342
	};

	// Sample pet data
	const petData: PetData[] = [
		{
			id: 1,
			name: 'Buddy',
			type: 'Dog',
			breed: 'Golden Retriever',
			age: '3 years',
			photo: '/api/placeholder/120/120'
		},
		{
			id: 2,
			name: 'Whiskers',
			type: 'Cat',
			breed: 'Maine Coon',
			age: '2 years',
			photo: '/api/placeholder/120/120'
		}
	];

	// Sample posts data
	const feedItems: FeedItemType[] = [
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

	return (
		<div className="dashboard-container">
			<NavBar />

			<div className="main-content">
				<div className="profile-container">
					<div className="profile-header-container">
						<div className="profile-cover-photo">
							<img src={userData.coverPhoto} alt="Cover" className="cover-photo" />
							<button className="edit-cover-photo">
								<FaCamera size={16} />
							</button>
						</div>

						<div className="profile-header-info">
							<div className="profile-avatar-container">
								<img src={userData.avatar} alt="Profile" className="profile-avatar" />
							</div>

							<div className="profile-actions">
								<button className="edit-profile-button">
									<FaEdit size={16} /> Edit Profile
								</button>
							</div>
						</div>

						<div className="profile-user-info">
							<p className="profile-username">{userData.username}</p>
							{/* Dog name */}
							<p className="profile-bio">{userData.bio}</p>

							<div className="profile-details">
								{userData.location && (
									<div className="profile-detail">
										<span className="profile-detail-icon">📍</span>
										<span className="profile-detail-text">{userData.location}</span>
									</div>
								)}

								{userData.website && (
									<div className="profile-detail">
										<span className="profile-detail-icon">🔗</span>
									</div>
								)}

								<div className="profile-detail">
									<span className="profile-detail-icon">📅</span>
									<span className="profile-detail-text">{userData.joinDate}</span>
								</div>
							</div>

							<div className="profile-stats">
								<div className="profile-stat">
									<span className="profile-stat-value">{userData.posts}</span>
									<span className="profile-stat-label">Posts</span>
								</div>
								<div className="profile-stat">
									<span className="profile-stat-value">{userData.followers}</span>
									<span className="profile-stat-label">Followers</span>
								</div>
								<div className="profile-stat">
									<span className="profile-stat-value">{userData.following}</span>
									<span className="profile-stat-label">Following</span>
								</div>
							</div>
						</div>
					</div>

					<div className="profile-content">
						<div className="profile-tabs">
							<button
								className={`profile-tab ${activeSection === 'posts' ? 'active' : ''}`}
								onClick={() => setActiveSection('posts')}
							>
								Posts
							</button>
							<button
								className={`profile-tab ${activeSection === 'pets' ? 'active' : ''}`}
								onClick={() => setActiveSection('pets')}
							>
								My Pets
							</button>
							<button
								className={`profile-tab ${activeSection === 'media' ? 'active' : ''}`}
								onClick={() => setActiveSection('media')}
							>
								Media
							</button>
							<button
								className={`profile-tab ${activeSection === 'liked' ? 'active' : ''}`}
								onClick={() => setActiveSection('liked')}
							>
								Liked
							</button>
						</div>

						{activeSection === 'posts' && (
							<div className="feed-items">
								{feedItems.map(item => (
									<FeedItem key={item.id} item={item} />
								))}
							</div>
            )}

					{activeSection === 'pets' && (
						<div className="profile-pets">
							<div className="add-pet-container">
								<button className="add-pet-button">+ Add a new pet</button>
							</div>

							<div className="pets-grid">
								{petData.map(pet => (
									<div key={pet.id} className="pet-card">
										<div className="pet-image-container">
											<img src={pet.photo} alt={pet.name} className="pet-image" />
										</div>
										<div className="pet-info">
											<h3 className="pet-name">{pet.name}</h3>
											<p className="pet-details">{pet.type} · {pet.breed}</p>
											<p className="pet-age">{pet.age}</p>
											<button className="edit-pet-button">Edit</button>
										</div>
									</div>
								))}
							</div>
						</div>
					)}

					{activeSection === 'media' && (
						<div className="profile-media">
							<div className="media-grid">
								{/* {postData.filter(post => post.image).map(post => (
									<div key={post.id} className="media-item">
										<img src={post.image} alt="Media" className="media-image" />
									</div>
								))} */}
							</div>
						</div>
					)}

					{activeSection === 'liked' && (
						<div className="profile-liked">
							<p className="no-content-message">No liked posts to show.</p>
						</div>
					)}
				</div>
			</div>
		</div>
    </div >
  );
};