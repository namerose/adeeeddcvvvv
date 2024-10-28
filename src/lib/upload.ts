import { storage } from './storage';
import imageCompression from 'browser-image-compression';

const MAX_IMAGE_SIZE = 1; // Max size in MB
const COMPRESSION_OPTIONS = {
  maxSizeMB: MAX_IMAGE_SIZE,
  maxWidthOrHeight: 800,
  useWebWorker: true
};

export async function uploadImage(file: File): Promise<string> {
  try {
    // Check file type
    if (!file.type.startsWith('image/')) {
      throw new Error('Invalid file type. Please upload an image file.');
    }

    // Check original file size
    const fileSizeInMB = file.size / (1024 * 1024);
    if (fileSizeInMB > 5) {
      throw new Error('File is too large. Please upload an image smaller than 5MB.');
    }

    // Compress image if needed
    let compressedFile = file;
    if (fileSizeInMB > MAX_IMAGE_SIZE) {
      compressedFile = await imageCompression(file, COMPRESSION_OPTIONS);
    }

    // Convert to base64 with size check
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onloadend = async () => {
        if (typeof reader.result === 'string') {
          try {
            // Generate a unique key for the image
            const imageKey = `profile_image_${Date.now()}`;
            
            // Clean up old images
            cleanupOldImages();
            
            // Store the compressed image
            localStorage.setItem(imageKey, reader.result);
            resolve(reader.result);
          } catch (error) {
            if (error instanceof Error && error.name === 'QuotaExceededError') {
              // If storage is full, try cleaning up and retrying
              cleanupOldImages();
              try {
                const imageKey = `profile_image_${Date.now()}`;
                localStorage.setItem(imageKey, reader.result);
                resolve(reader.result);
              } catch (retryError) {
                reject(new Error('Unable to store image. Please try a smaller image.'));
              }
            } else {
              reject(error);
            }
          }
        } else {
          reject(new Error('Failed to convert image'));
        }
      };

      reader.onerror = () => {
        reject(new Error('Failed to read image file'));
      };

      reader.readAsDataURL(compressedFile);
    });
  } catch (error) {
    throw error;
  }
}

// Helper function to clean up old profile images
function cleanupOldImages() {
  const keys = Object.keys(localStorage);
  const imageKeys = keys.filter(key => key.startsWith('profile_image_'));
  
  // Sort by timestamp (newest first)
  imageKeys.sort((a, b) => {
    const timeA = parseInt(a.split('_')[2]);
    const timeB = parseInt(b.split('_')[2]);
    return timeB - timeA;
  });

  // Keep only the most recent image
  imageKeys.slice(1).forEach(key => {
    localStorage.removeItem(key);
  });
}