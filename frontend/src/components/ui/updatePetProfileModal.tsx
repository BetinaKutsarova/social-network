import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { PetData } from "../../interfaces/profile";
import { uploadImageToCloud } from "../../utils/uploadImageToCloud";
import { FaCamera, FaTimes } from "react-icons/fa";
import { updatePetProfile } from "../../services/updatePetProfile";

interface UpdatePetProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPetUpdate: (updatedPet: PetData) => void;
  pet: PetData;
}

export const UpdatePetProfileModal: React.FC<UpdatePetProfileModalProps> = ({
  isOpen,
  onClose,
  onPetUpdate,
  pet,
}) => {
  const [formData, setFormData] = useState<Omit<PetData, 'id' | 'userId'>>({
    name: pet?.name || "",
    species: pet?.species || "",
    breed: pet?.breed || "",
    ageYears: pet?.ageYears || undefined,
    bio: pet?.bio || "",
  });

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    pet?.avatarUrl || null
  );
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
      let avatarUrl = pet?.avatarUrl;

      if (avatarFile) {
        avatarUrl = await uploadImageToCloud(avatarFile, "user-avatars");
      }

      const updateData: PetData = {
        ...pet,
        ...formData,
        avatarUrl: avatarUrl,
      };

      if (pet && pet.id) {
        const updatedPet = await updatePetProfile(pet.id, updateData);
        onPetUpdate(updatedPet);
        onClose();
      }
    } catch (error) {
      console.error("Error updating pet profile:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Edit Pet Profile</h2>
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
                  {pet?.name ? pet.name.charAt(0).toUpperCase() : "P"}
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
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};