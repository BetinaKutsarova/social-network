import React, { useState, useRef, ChangeEvent, FormEvent } from "react";
import { FaCamera, FaTimes } from "react-icons/fa";
import { updateUserProfile } from "../../services/updateUserProfile";
import { UpdateUserData } from "../../interfaces/form";
import { userAtom } from "../../state/atoms";
import { useAtom } from "jotai";
import { uploadImageToCloud } from "../../utils/uploadImageToCloud";

interface UpdateUserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileUpdate: (updatedUser: UpdateUserData) => void;
}

export const UpdateUserProfileModal: React.FC<UpdateUserProfileModalProps> = ({
  isOpen,
  onClose,
  onProfileUpdate,
}) => {
  const [user] = useAtom(userAtom);

  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
  });

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    user?.avatarUrl || null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];

    // Preview the selected image
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let avatarUrl = user?.avatarUrl;

      if (avatarFile) {
        avatarUrl = await uploadImageToCloud(avatarFile, "user-avatars");
      }

      const updateData = {
        ...formData,
        avatarUrl: avatarUrl,
      };

      if (user && user.id) {
        const updatedUser = await updateUserProfile(user.id, updateData);
        onProfileUpdate(updatedUser);
        onClose();
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Edit Profile</h2>
          <button className="close-button" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="avatar-upload-section">
            <div className="avatar-upload" onClick={handleAvatarClick}>
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Avatar preview"
                  className="avatar-preview"
                />
              ) : (
                <div className="avatar-placeholder">
                  {user?.username ? user.username.charAt(0).toUpperCase() : "U"}
                </div>
              )}
              <div className="avatar-overlay">
                <FaCamera size={20} />
                <span>Change</span>
              </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              style={{ display: "none" }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="save-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
