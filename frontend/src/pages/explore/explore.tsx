import React, { useState } from "react";
import { NavBar } from "../../components/ui/navbar";
import { FaSearch } from "react-icons/fa";
import { Pagination } from "../../components/ui/pagination";
import { UserCard } from "../../components/ui/userCard";
import { useExploreUsers } from "../../hooks/useExploreUsers";
import "./explore.css";

export const Explore: React.FC = () => {
  const [searchInput, setSearchInput] = useState<string>("");
  const {
    users,
    isLoading,
    error,
    pagination,
    handlePageChange,
    searchUsers,
    isSearchMode,
    searchQuery
  } = useExploreUsers();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);
    searchUsers(value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    searchUsers(searchInput);
  };

  return (
    <div className="dashboard-container">
      <NavBar />

      <div className="main-content">
        <div className="explore-container">
          <div className="explore-header">
            <h1 className="explore-title">Explore other users and trainers</h1>
            <p className="explore-subtitle">Find your Pet Pals by username or email</p>
          </div>

          <div className="search-container">
            <form className="search-form" onSubmit={handleSubmit}>
              <div className="search-input-container">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search by email..."
                  value={searchInput}
                  onChange={handleInputChange}
                />
                <button type="submit" className="search-button">
                  <FaSearch />
                </button>
              </div>
            </form>
          </div>

          <div className="search-results-container">
            {isLoading ? (
              <p className="loading-message">{isSearchMode ? "Searching for users..." : "Loading users..."}</p>
            ) : error ? (
              <p className="error-message">{error}</p>
            ) : users.length > 0 ? (
              <>
                <h2 className="results-title">
                  {isSearchMode ? `Search Results for "${searchQuery}"` : "All Users"}
                </h2>
                <div className="user-grid">
                  {users.map((user) => (
                    <UserCard key={user.id} user={user} />
                  ))}
                </div>

                <Pagination
                  currentPage={pagination.page}
                  onPageChange={handlePageChange}
                  hasNextPage={pagination.hasMore}
                />
              </>
            ) : isSearchMode ? (
              <p className="no-results-message">
                No users found matching "{searchQuery}"
              </p>
            ) : (
              <p className="no-results-message">No users found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};