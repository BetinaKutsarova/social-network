import React from "react";
import "./profile.css";
import { FaEdit, FaCamera } from "react-icons/fa";
import { NavBar } from "../../components/ui/navbar";
import { useAtom } from "jotai";
import { activeSectionAtom, userAtom } from "../../state/atoms";
import { FeedItem } from "../../components/ui/feedItem";
import { useUserPosts } from "../../hooks/useUserPosts";
import { Pagination } from "../../components/ui/pagination";
// import { FeedItemType } from '../../interfaces/dashboard';

export const Profile: React.FC = () => {
  const [activeSection, setActiveSection] = useAtom(activeSectionAtom);
  const [user] = useAtom(userAtom);

  const { userPosts, isLoading, error, pagination, handlePageChange } =
    useUserPosts();

  return (
    <div className="dashboard-container">
      <NavBar />

      <div className="main-content">
        <div className="profile-container">
          <div className="profile-header-container">
            <div className="profile-cover-photo">
              PHOTO
              <button className="edit-cover-photo">
                <FaCamera size={16} />
              </button>
            </div>

            <div className="profile-header-info">
              <div className="profile-avatar-container">AVATAR PHOTO</div>

              <div className="profile-actions">
                <button className="edit-profile-button">
                  <FaEdit size={16} /> Edit Profile
                </button>
              </div>
            </div>

            <div className="profile-user-info">
              <p className="profile-username">{user?.username}</p>
              <p className="profile-email">{user?.email}</p>

              <div className="profile-details"></div>
            </div>
          </div>

          <div className="profile-content">
            <div className="profile-tabs">
              <button
                className={`profile-tab ${
                  activeSection === "posts" ? "active" : ""
                }`}
                onClick={() => setActiveSection("posts")}
              >
                Posts
              </button>
              <button
                className={`profile-tab ${
                  activeSection === "pets" ? "active" : ""
                }`}
                onClick={() => setActiveSection("pets")}
              >
                My Pets
              </button>
              <button
                className={`profile-tab ${
                  activeSection === "media" ? "active" : ""
                }`}
                onClick={() => setActiveSection("media")}
              >
                Media
              </button>
              <button
                className={`profile-tab ${
                  activeSection === "liked" ? "active" : ""
                }`}
                onClick={() => setActiveSection("liked")}
              >
                Liked
              </button>
            </div>

            {activeSection === "posts" && (
              <div className="feed-items">
                {isLoading && userPosts.length === 0 ? (
                  <p>Loading posts...</p>
                ) : error ? (
                  <p className="error-message">{error}</p>
                ) : userPosts.length > 0 ? (
                  <>
                    {userPosts.map((post) => (
                      <FeedItem key={post.id} item={post} />
                    ))}

                    {userPosts.length > 0 && (
                      <Pagination
                        currentPage={pagination.page}
                        onPageChange={handlePageChange}
                        hasNextPage={pagination.hasMore}
                      />
                    )}

                    {isLoading && <p className="loading-message">Loading...</p>}
                  </>
                ) : (
                  <p>No posts to show.</p>
                )}
              </div>
            )}

            {activeSection === "pets" && (
              <div className="profile-pets">
                <div className="add-pet-container">
                  <button className="add-pet-button">+ Add a new pet</button>
                </div>

                {/* <div className="pets-grid">
								{userData?.pets.map(pet => (
									<div key={pet.id} className="pet-card">
										<div className="pet-image-container">
											<img src={pet.avatarUrl} alt={pet.name} className="pet-image" />
										</div>
										<div className="pet-info">
											<h3 className="pet-name">{pet.name}</h3>
											<p className="pet-details">{pet.species} · {pet.breed}</p>
											<p className="pet-age">{pet.ageYears}</p>
											<button className="edit-pet-button">Edit</button>
										</div>
									</div>
								))}
							</div> */}
              </div>
            )}

            {activeSection === "media" && (
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

            {activeSection === "liked" && (
              <div className="profile-liked">
                <p className="no-content-message">No liked posts to show.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
