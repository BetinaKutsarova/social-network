import React, { useEffect, useState } from "react";
import "./profile.css";
import { FaEdit, FaCamera } from "react-icons/fa";
import { NavBar } from "../../components/ui/navbar";
import { useAtom } from "jotai";
import {
  activeSectionAtom,
  userAtom,
  profileAtom,
  activeTabAtom,
} from "../../state/atoms";
import { FeedItem } from "../../components/ui/feedItem";
import { useUserPosts } from "../../hooks/useUserPosts";
import { Pagination } from "../../components/ui/pagination";
import { UpdateUserProfileModal } from "../../components/ui/updateUserProfileModal";
import { UpdateUserData } from "../../interfaces/form";
import { useParams } from "react-router-dom";
import { api } from "../../services/api";
import { useUserPets } from "../../hooks/useUserPets";
import { PetItem } from "../../components/ui/petItem";
import { PetData } from "../../interfaces/profile";
import { UpdatePetProfileModal } from "../../components/ui/updatePetProfileModal";
import "../../components/ui/updateModal.css";
import { CreatePetProfileModal } from "../../components/ui/createPetModal";

export const Profile: React.FC = () => {
  const [activeSection, setActiveSection] = useAtom(activeSectionAtom);
  const [, setActiveTab] = useAtom(activeTabAtom);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isEditPetModalOpen, setIsEditPetModalOpen] = useState<boolean>(false);
  const [isCreatePetModalOpen, setIsCreatePetModalOpen] =
    useState<boolean>(false);
  const [user, setUser] = useAtom(userAtom);
  const [pet, setPet] = useState<PetData>();
  const [profile, setProfile] = useAtom(profileAtom);
  const [, setIsLoading] = useState(true);

  const params = useParams();
  const userId = params.userId;
  const isOwnProfile = !userId || (user && userId === user.id);

  useEffect(() => {
    const fetchProfileData = async () => {
      setIsLoading(true);
      try {
        if (userId && userId !== user?.id) {
          const fetchedProfile = await api.get(`users/${userId}`);
          setProfile(fetchedProfile.data);
        } else {
          setProfile(user);
          setActiveTab("profile");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [userId, user, setProfile, setActiveTab]);

  // PETS
  const {
    pets,
    isLoading: petsLoading,
    error: petsError,
    refreshPets,
  } = useUserPets(userId && !isOwnProfile ? userId : undefined);

  const handlePetCreate = () => {
    setIsCreatePetModalOpen(true);
  };

  const handlePetUpdate = (updatedPet: PetData) => {
    if (user && isOwnProfile) {
      setPet(updatedPet);
      setIsEditPetModalOpen(true);
      refreshPets();
    }
  };

  const {
    userPosts,
    isLoading: postsLoading,
    error,
    pagination,
    handlePageChange,
    refreshPosts,
  } = useUserPosts(userId && !isOwnProfile ? userId : undefined);

  const handleProfileUpdate = (updatedUser: UpdateUserData) => {
    if (user && isOwnProfile) {
      setUser({
        ...user,
        ...updatedUser,
      });
    }
  };

  return (
    <div className="dashboard-container">
      <NavBar />

      <div className="main-content">
        <div className="profile-container">
          <div className="profile-header-container">
            <div
              className="profile-cover-photo"
              style={{
                height: "200px",
                width: "100%",
                backgroundImage: 'url("https://picsum.photos/1200/400")',
                backgroundSize: "cover",
                backgroundPosition: "center",
                position: "relative",
              }}
            >
              {isOwnProfile && (
                <button className="edit-cover-photo">
                  <FaCamera size={16} />
                </button>
              )}
            </div>

            <div className="profile-header-info">
              <div className="profile-avatar-container">
                {profile?.avatarUrl ? (
                  <img
                    src={profile?.avatarUrl}
                    alt={`${profile?.username}'s avatar`}
                    className="profile-avatar"
                  />
                ) : (
                  <div className="profile-avatar-placeholder">
                    {profile?.username.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              <div className="profile-actions">
                {isOwnProfile ? (
                  <button
                    className="edit-profile-button"
                    onClick={() => setIsEditModalOpen(true)}
                  >
                    <FaEdit size={16} /> Edit Profile
                  </button>
                ) : (
                  <button
                    className="message-button"
                    // onClick={() => handleMessageButtonClick(profile?.id)}
                  >
                    Message
                  </button>
                )}
              </div>
            </div>

            <div className="profile-user-info">
              <p className="profile-username">{profile?.username}</p>
              {isOwnProfile && (
                <p className="profile-email">{profile?.email}</p>
              )}

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
                {isOwnProfile ? "My Pets" : "Pets"}
              </button>
              <button
                className={`profile-tab ${
                  activeSection === "media" ? "active" : ""
                }`}
                onClick={() => setActiveSection("media")}
              >
                Media
              </button>
              {isOwnProfile && (
                <button
                  className={`profile-tab ${
                    activeSection === "liked" ? "active" : ""
                  }`}
                  onClick={() => setActiveSection("liked")}
                >
                  Liked
                </button>
              )}
            </div>

            {activeSection === "posts" && (
              <div className="feed-items">
                {postsLoading && userPosts.length === 0 ? (
                  <p className="loading-message">Loading posts...</p>
                ) : error ? (
                  <p className="error-message">{error}</p>
                ) : userPosts.length > 0 ? (
                  <>
                    {userPosts.map((post) => (
                      <FeedItem
                        key={post.id}
                        item={post}
                        avatarUrl={profile?.avatarUrl}
                        currentUser={user}
                        onDelete={() => {
                          refreshPosts(pagination.page);
                        }}
                      />
                    ))}

                    {userPosts.length > 0 && (
                      <Pagination
                        currentPage={pagination.page}
                        onPageChange={handlePageChange}
                        hasNextPage={pagination.hasMore}
                      />
                    )}

                    {postsLoading && (
                      <p className="loading-message">Loading...</p>
                    )}
                  </>
                ) : (
                  <p className="no-content-message">No posts to show.</p>
                )}
              </div>
            )}

            {activeSection === "pets" && (
              <div className="profile-pets">
                {isOwnProfile && (
                  <div className="add-pet-container">
                    <button
                      className="add-pet-button"
                      onClick={handlePetCreate}
                    >
                      + Add a new pet
                    </button>
                  </div>
                )}

                {petsLoading && pets.length === 0 ? (
                  <div className="loading-message">Loading pets...</div>
                ) : petsError ? (
                  <div className="error-message">{petsError}</div>
                ) : pets?.length > 0 ? (
                  <div className="pets-grid">
                    {pets.map((pet) => (
                      <PetItem
                        key={pet.id}
                        pet={pet}
                        isOwnProfile={isOwnProfile || false}
                        onDelete={() => {
                          refreshPets();
                        }}
                        onEdit={handlePetUpdate}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="no-content-message">No pets to show.</div>
                )}
              </div>
            )}

            {activeSection === "media" && (
              // <div className="active-section">
              <p className="no-content-message">No media to show.</p>
              // </div>
            )}

            {activeSection === "liked" && isOwnProfile && (
              // <div className="active-section">
              <p className="no-content-message">No liked posts to show.</p>
              // </div>
            )}
          </div>
        </div>
      </div>
      {isOwnProfile && user && (
        <>
          <UpdateUserProfileModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onProfileUpdate={handleProfileUpdate}
          />

          {pet && (
            <UpdatePetProfileModal
              isOpen={isEditPetModalOpen}
              onClose={() => setIsEditPetModalOpen(false)}
              onPetUpdate={handlePetUpdate}
              pet={pet}
            />
          )}

          <CreatePetProfileModal
            isOpen={isCreatePetModalOpen}
            onClose={() => setIsCreatePetModalOpen(false)}
            onPetCreate={() => {
              refreshPets();
              setIsCreatePetModalOpen(false);
            }}
          />
        </>
      )}
    </div>
  );
};
