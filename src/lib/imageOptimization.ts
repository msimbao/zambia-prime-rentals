import imageCompression from 'browser-image-compression';

export interface CompressionProgress {
  current: number;
  total: number;
  percentage: number;
}

export const compressImage = async (
  file: File,
  onProgress?: (progress: number) => void
): Promise<File> => {
  const options = {
    maxSizeMB: 0.8, // Target max file size 800KB
    maxWidthOrHeight: 1920, // Max dimension
    useWebWorker: true,
    fileType: 'image/webp', // Convert to WebP
    onProgress: onProgress,
  };

  try {
    const compressedFile = await imageCompression(file, options);
    return compressedFile;
  } catch (error) {
    console.error('Error compressing image:', error);
    // Return original file if compression fails
    return file;
  }
};

export const compressMultipleImages = async (
  files: File[],
  onProgress?: (progress: CompressionProgress) => void
): Promise<File[]> => {
  const compressedFiles: File[] = [];
  
  for (let i = 0; i < files.length; i++) {
    const compressedFile = await compressImage(files[i], (fileProgress) => {
      if (onProgress) {
        onProgress({
          current: i + 1,
          total: files.length,
          percentage: Math.round(((i + fileProgress / 100) / files.length) * 100),
        });
      }
    });
    compressedFiles.push(compressedFile);
  }

  return compressedFiles;
};

// Add Cloudinary transformation parameters to URL
export const getOptimizedImageUrl = (
  url: string,
  options?: {
    width?: number;
    height?: number;
    crop?: 'fill' | 'fit' | 'scale';
    quality?: 'auto' | number;
  }
): string => {
  if (!url || !url.includes('cloudinary.com')) {
    return url;
  }

  const { width, height, crop = 'fill', quality = 'auto' } = options || {};
  
  // Insert transformation parameters before '/upload/'
  const transformations: string[] = ['f_auto']; // Auto format (WebP for supported browsers)
  
  if (quality) {
    transformations.push(`q_${quality}`);
  }
  
  if (width) {
    transformations.push(`w_${width}`);
  }
  
  if (height) {
    transformations.push(`h_${height}`);
  }
  
  if (width || height) {
    transformations.push(`c_${crop}`);
  }

  const transformString = transformations.join(',');
  
  return url.replace('/upload/', `/upload/${transformString}/`);
};
