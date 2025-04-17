import React from "react";
import { Link } from "react-router-dom";
import { User } from "../../state/atoms";

interface UserCardProps {
  user: User;
}

export const UserCard: React.FC<UserCardProps> = ({ user }) => {
  return (
    <div className="user-card">
      <div className="user-avatar-container">
        {user.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={`${user.username}'s avatar`}
            className="user-avatar"
          />
        ) : (
          <div className="user-avatar-placeholder">
            {user.username.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      
      <div className="user-info">
        <h3 className="user-username">{user.username}</h3>
        <p className="user-email">{user.email}</p>
				<p className="user-role">{user.role}</p>
      </div>
      
      <div className="user-actions">
        <Link to={`/profile/${user.id}`} className="view-profile-button">
          View Profile
        </Link>
      </div>
    </div>
  );
};