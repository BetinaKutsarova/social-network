import React from 'react';
import './dashboard.css';
import { NavBar } from '../../components/ui/navbar';
// import { FeedItem } from '../../components/ui/feedItem';
import type { TrendingTopic, SuggestionUser } from '../../interfaces/dashboard'
import { useAtom } from 'jotai';
import { userAtom } from '../../state/atoms';
import { useAllPosts } from '../../hooks/useAllPosts';
import { FeedItem } from '../../components/ui/feedItem';


export const Dashboard: React.FC = () => {
	const [user] = useAtom(userAtom);

	const { allPosts, isLoading, error } = useAllPosts();

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
								{/* <img src={""} alt="Your avatar" className="avatar" width="40" height="40" /> */}
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
							{isLoading ? (
								<p>Loading posts...</p>
							) : error ? (
								<p className="error-message">{error}</p>
							) : allPosts.length > 0 ? (
								allPosts.map(post => (
									<FeedItem key={post.id} item={post} />
								))
							) : (
								<p>No posts to show.</p>
							)}
						</div>
					</div>

					<div className="right-sidebar">
						<div className="profile-card">
							<div className="profile-header">
								{/* <img src={""} alt="Profile" className="avatar" width="64" height="64" /> */}
								<div>
									<h3 className="profile-username">{user?.username}</h3>
									<p className="profile-email">{user?.email}</p>
								</div>
							</div>
							<div className="profile-stats">
								<div className="profile-stat">
									{/* <p className="profile-stat-value">{userData?.posts}</p> */}
									<p className="profile-stat-label">Posts</p>
								</div>
								<div className="profile-stat">
									{/* <p className="profile-stat-value">{user?.followers}</p> */}
									<p className="profile-stat-label">Followers</p>
								</div>
								<div className="profile-stat">
									{/* <p className="profile-stat-value">{user?.following}</p> */}
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

