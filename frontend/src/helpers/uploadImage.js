const uploadImage = async (image) => {
  const url = `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUD_NAME_CLOUDINARY}/image/upload`;

  const formData = new FormData();
  formData.append("file", image);
  formData.append("upload_preset", "mern_product");

  try {
    const res = await fetch(url, { method: "POST", body: formData });
    const data = await res.json();
    console.log("Upload Response:", data);

    // sirf secure_url return karo
    return { url: data.secure_url };
  } catch (err) {
    console.error("Upload failed:", err);
  }
};

export default uploadImage;
