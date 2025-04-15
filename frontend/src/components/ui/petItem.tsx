import { FaEdit, FaTrash } from 'react-icons/fa';
import { PetData } from '../../interfaces/profile';
import { deletePet } from '../../services/deletePet';

export interface PetItemProps {
	pet: PetData;
	isOwnProfile: boolean;
	onDelete?: () => void;
  onEdit?: (pet: PetData) => void;
}

export const PetItem: React.FC<PetItemProps> = ({
  pet,
  isOwnProfile,
  onDelete,
  onEdit,
}) => {
  const handleDelete = async () => {
    try {
      await deletePet(pet.id);
      if (onDelete) {
        onDelete();
      }
    } catch (error) {
      console.error("Failed to delete pet:", error);
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(pet);
    }
  };

  return (
    <div className="pet-card">
      <div className="pet-image-container">
        <img
          src={pet.avatarUrl}
          alt={pet.name}
          className="pet-image"
        />
      </div>
      <div className="pet-info">
        <div className="pet-header">
          <h3 className="pet-name">{pet.name}</h3>
          {isOwnProfile && (
            <div className="pet-actions">
              <button 
                className="edit-pet-button"
                onClick={handleEdit}
                aria-label="Edit pet"
                title="Edit pet"
              >
                <FaEdit />
              </button>
              <button
                className="delete-pet-button"
                onClick={handleDelete}
                aria-label="Delete pet"
                title="Delete pet"
              >
                <FaTrash />
              </button>
            </div>
          )}
        </div>
        <div className="pet-details-container">
          <div className="pet-detail">
            <span className="pet-label">Species:</span>{" "}
            {pet.species}
          </div>
          <div className="pet-detail">
            <span className="pet-label">Breed:</span>{" "}
            {pet.breed}
          </div>
          <div className="pet-detail">
            <span className="pet-label">Age:</span>{" "}
            {pet.ageYears}{" "}
            {pet.ageYears === 1 ? "year" : "years"}
          </div>
        </div>
      </div>
    </div>
  );
};