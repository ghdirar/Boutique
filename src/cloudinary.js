const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export async function uploadProductImage(file) {
  if (!cloudName || !uploadPreset) {
    throw new Error("Configuration Cloudinary manquante.");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error?.message || "Upload Cloudinary impossible.");
  }

  return {
    imageUrl: data.secure_url,
    imagePublicId: data.public_id,
  };
}
