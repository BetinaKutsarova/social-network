import type { FeedItemProps } from '../../interfaces/dashboard';

export const FeedItem: React.FC<FeedItemProps> = ({ item }) => {
	return (
		<div className="feed-item">
			<div className="feed-item-header">
				{/* <img src={item.avatar} alt={item.author} className="avatar" width="40" height="40" /> */}
				<div className="feed-item-user-info">
					<div className="feed-item-meta">
						{/* <h4 className="feed-item-author">{item.userId}</h4> */}
						<span className="feed-item-username">{item.author.username}</span>
						<span className="feed-item-time">·</span>
						<span className="feed-item-time">{item.createdAt}</span>
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