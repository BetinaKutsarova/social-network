// import React, { useState } from 'react';
import './dashboard.css';
import { NavBar } from '../../components/ui/navbar';
import { FeedItem } from '../../components/ui/feedItem';

import type {
	UserData,
	FeedItemType,
	TrendingTopic,
	SuggestionUser
} from '../../interfaces/dashboard'


export const Dashboard: React.FC = () => {
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
				<NavBar />
				<div className="main-content">
					<div className="feed">
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

						<div className="feed-items">
							{feedItems.map(item => (
								<FeedItem key={item.id} item={item} />
							))}
						</div>
					</div>

					<div className="right-sidebar">
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

