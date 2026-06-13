import { ALLOWED_IMAGE_MIMES, MAX_IMAGE_BYTES } from "./constants";

export function validateImageUpload(file) {
  if (!file) return "No file selected.";
  if (!ALLOWED_IMAGE_MIMES.includes(file.type)) {
    return "Only JPEG, PNG, GIF, and WEBP images are allowed.";
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return "Image must be 8 MB or smaller.";
  }
  if (file.name.toLowerCase().endsWith(".svg") || file.type === "image/svg+xml") {
    return "SVG uploads are not allowed.";
  }
  return null;
}

export function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Could not read file."));
    reader.readAsDataURL(file);
  });
}
