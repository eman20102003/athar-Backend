import cloudinary from "../config/cloudinary.js";

const uploadToCloudinary = (buffer, folder, resourceType = "image") => {
  return new Promise((resolve, reject) => {
    const uploadFn = resourceType === "raw"
      ? cloudinary.uploader.upload_chunked_stream ?? cloudinary.uploader.upload_stream
      : cloudinary.uploader.upload_stream;

    const stream = uploadFn(
      {
        folder: `athar/${folder}`,
        resource_type: resourceType,
        chunk_size: 6000000,
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
    stream.end(buffer);
  });
};

export default uploadToCloudinary;