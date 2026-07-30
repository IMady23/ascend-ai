import { ref, uploadBytesResumable, getDownloadURL, deleteObject, UploadTask } from "firebase/storage";
import { collection, doc, setDoc, deleteDoc, serverTimestamp, query, orderBy, getDocs, getDoc } from "firebase/firestore";
import { storage, firestore } from "@/lib/firebase";
import { ProgressPhoto, progressPhotoConverter, AttachmentMetadata } from "@/types/storage";
import { handleFirestoreError } from "./error-handler";
import { UserRepository } from "./user.repository";

// Helper: Compress Image
const compressImage = async (file: File, maxSizeMB: number = 2): Promise<File> => {
  return new Promise((resolve, reject) => {
    // Only compress images
    if (!file.type.startsWith("image/")) {
      return resolve(file);
    }
    
    // Check if compression is needed (approximate)
    if (file.size < maxSizeMB * 1024 * 1024) {
      return resolve(file);
    }

    const img = document.createElement("img");
    const objectUrl = URL.createObjectURL(file);
    
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      
      const canvas = document.createElement("canvas");
      let width = img.width;
      let height = img.height;
      
      // Calculate new dimensions (max 1920x1080 loosely)
      const maxDim = 1920;
      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }

      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext("2d");
      if (!ctx) return resolve(file); // Fallback
      
      ctx.drawImage(img, 0, 0, width, height);
      
      // Compress
      canvas.toBlob((blob) => {
        if (!blob) return resolve(file);
        
        const compressedFile = new File([blob], file.name, {
          type: "image/jpeg",
          lastModified: Date.now(),
        });
        
        resolve(compressedFile);
      }, "image/jpeg", 0.8);
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(file); // Fallback if error
    };
    
    img.src = objectUrl;
  });
};

export const StorageRepository = {
  
  // Generic File Upload Helper with Progress
  async uploadFileWithProgress(
    userId: string,
    path: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<string> {
    try {
      const compressedFile = await compressImage(file);
      const storageRef = ref(storage, path);
      const uploadTask = uploadBytesResumable(storageRef, compressedFile);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            if (onProgress) onProgress(progress);
          },
          (error) => {
            reject(error);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          }
        );
      });
    } catch (error) {
      handleFirestoreError(error, `uploading file to ${path}`);
    }
  },

  // Generic File Delete Helper
  async deleteFile(path: string): Promise<void> {
    try {
      const storageRef = ref(storage, path);
      await deleteObject(storageRef);
    } catch (error: any) {
      // Ignore object-not-found errors on delete
      if (error.code !== "storage/object-not-found") {
        handleFirestoreError(error, `deleting file at ${path}`);
      }
    }
  },

  // Avatar Management
  // Removed avatar methods to match Sprint 1 UserProfile schema

  // Progress Photos Management
  getProgressPhotosRef(userId: string) {
    return collection(firestore, `users/${userId}/progress_photos`).withConverter(progressPhotoConverter);
  },

  async uploadProgressPhoto(
    userId: string, 
    file: File, 
    metadata: { caption?: string; weight?: number; chapterId?: string },
    onProgress?: (progress: number) => void
  ): Promise<ProgressPhoto> {
    const photoId = `photo_${Date.now()}`;
    const extension = file.type === "image/png" ? "png" : "jpg";
    const path = `users/${userId}/progress/${photoId}.${extension}`;
    
    const url = await this.uploadFileWithProgress(userId, path, file, onProgress);
    
    const photoData: Omit<ProgressPhoto, "id"> = {
      url,
      userId,
      storagePath: path,
      caption: metadata.caption,
      weight: metadata.weight,
      chapterId: metadata.chapterId,
      uploadedAt: serverTimestamp() as any, // Cast for local use before fetch
    };
    
    const docRef = doc(this.getProgressPhotosRef(userId), photoId);
    await setDoc(docRef, photoData);
    
    return { ...photoData, id: photoId };
  },

  async deleteProgressPhoto(userId: string, photo: ProgressPhoto): Promise<void> {
    try {
      // Delete from Storage
      await this.deleteFile(photo.storagePath);
      // Delete metadata from Firestore
      const docRef = doc(this.getProgressPhotosRef(userId), photo.id);
      await deleteDoc(docRef);
    } catch (error) {
      handleFirestoreError(error, `deleting progress photo ${photo.id}`);
    }
  },

  async getProgressPhotos(userId: string): Promise<ProgressPhoto[]> {
    try {
      const q = query(this.getProgressPhotosRef(userId), orderBy("uploadedAt", "desc"));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => doc.data());
    } catch (error) {
      handleFirestoreError(error, `fetching progress photos for user ${userId}`);
    }
  },

  // Future Attachment Management (Stubs)
  async uploadAttachment(userId: string, file: File, context: AttachmentMetadata["context"]): Promise<string> {
    const attachmentId = `attach_${Date.now()}`;
    const extension = file.name.split('.').pop() || "jpg";
    
    let folder = "attachments";
    if (context === "ai") folder = "ai";
    else if (context === "meal") folder = "meals";
    else if (context === "workout") folder = "workouts";
    
    const path = `users/${userId}/${folder}/${attachmentId}.${extension}`;
    const url = await this.uploadFileWithProgress(userId, path, file);
    return url;
  }
};
