import cloudinary from "../config/cloudinary.js";

const uploadToCloudinary = (buffer, folder, resourceType = "image") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: `athar/${folder}`, resource_type: resourceType },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(buffer);
  });
};

export default uploadToCloudinary;