import axios from "axios";

export const uploadImageToCloud = async (
  file: File,
  uploadPreset: string = "user-avatars",
  cloudName: string = "pet-pals"
): Promise<string> => {
  if (!file) {
    throw new Error("No file provided for upload");
  }

  const cloudinaryFormData = new FormData();
  cloudinaryFormData.append("file", file);
  cloudinaryFormData.append("upload_preset", uploadPreset);

  try {
    const cloudinaryResponse = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      cloudinaryFormData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return cloudinaryResponse.data.secure_url;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Failed to upload image to Cloudinary: ${error.message}`);
    }
    throw error;
  }
};
