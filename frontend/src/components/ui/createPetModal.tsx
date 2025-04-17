import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { PetData } from "../../interfaces/profile";
import { uploadImageToCloud } from "../../utils/uploadImageToCloud";
import { FaCamera, FaTimes } from "react-icons/fa";
import { createPet, CreatePetData } from "../../services/createPet";

interface CreatePetProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPetCreate: (newPet: PetData) => void;
}

export const CreatePetProfileModal: React.FC<CreatePetProfileModalProps> = ({
  isOpen,
  onClose,
  onPetCreate,
}) => {
  const [formData, setFormData] = useState<Omit<PetData, 'id' | 'userId'>>({
    name: "",
    species: "",
    breed: "",
    ageYears: undefined,
    bio: "",
  });

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      let avatarUrl = null;

      if (avatarFile) {
        avatarUrl = await uploadImageToCloud(avatarFile, "user-avatars");
      }

      const petData: CreatePetData = {
        ...formData,
        avatarUrl: avatarUrl
      };

      const newPet = await createPet(petData);
      onPetCreate(newPet);
      onClose();
      // Reset form after successful creation
      setFormData({
        name: "",
        species: "",
        breed: "",
        ageYears: undefined,
        bio: "",
      });
      setAvatarFile(null);
      setAvatarPreview(null);
    } catch (error) {
      console.error("Error creating pet profile:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Create New Pet Profile</h2>
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
                  alt="Pet avatar preview"
                  className="avatar-preview"
                />
              ) : (
                <div className="avatar-placeholder">
                  {formData.name ? formData.name.charAt(0).toUpperCase() : "P"}
                </div>
              )}
              <div className="avatar-overlay">
                <FaCamera size={20} />
                <span>Upload</span>
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
            <label htmlFor="name">Pet Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="species">Species</label>
            <input
              type="text"
              id="species"
              name="species"
              value={formData.species}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="breed">Breed (Optional)</label>
            <input
              type="text"
              id="breed"
              name="breed"
              value={formData.breed}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="ageYears">Age in Years (Optional)</label>
            <input
              type="number"
              id="ageYears"
              name="ageYears"
              value={formData.ageYears || ''}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="bio">Bio (Optional)</label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              rows={4}
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
              {isSubmitting ? "Creating..." : "Create Pet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};