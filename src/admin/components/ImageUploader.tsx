import { useState } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { FiUpload, FiX, FiCamera } from "react-icons/fi";
import axiosInstance from "../../services/axios";
import { toast } from "react-hot-toast";
import { BASE_URL } from "../../services/api";

const UploaderContainer = styled.div`
  margin-bottom: 1rem;
  width: 100%;
`;

const UploadArea = styled.div<{ $isDragging: boolean }>`
  border: 2px dashed
    ${({ $isDragging }) => ($isDragging ? "#74b9ff" : "#e0e7ff")};
  padding: 3rem 2rem;
  border-radius: 16px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${({ $isDragging }) =>
    $isDragging ? "rgba(116, 185, 255, 0.1)" : "#f8faff"};
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;

  &:hover {
    border-color: #74b9ff;
    background: rgba(116, 185, 255, 0.1);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }
`;

const UploadIcon = styled(motion.div)`
  margin-bottom: 1.5rem;
  color: #4b5563;
  background: rgba(116, 185, 255, 0.1);
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  ${UploadArea}:hover & {
    background: rgba(116, 185, 255, 0.2);
    transform: scale(1.05);
  }

  svg {
    width: 32px;
    height: 32px;
    color: #3b82f6;
  }
`;

const UploadText = styled.div`
  color: #4b5563;
  max-width: 280px;
  margin: 0 auto;

  h4 {
    margin: 0 0 0.75rem;
    font-size: 1.2rem;
    font-weight: 500;
    color: #374151;
  }

  p {
    margin: 0;
    font-size: 0.95rem;
    color: #6b7280;
    line-height: 1.5;
  }
`;

const ImagePreview = styled(motion.div)`
  position: relative;
  display: inline-block;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const PreviewImage = styled.img`
  max-width: 300px;
  width: 100%;
  height: 200px;
  object-fit: cover;
  display: block;
  transition: transform 0.3s ease;
`;

const ImageOverlay = styled(motion.div)`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  opacity: 0;
  transition: opacity 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;

  ${ImagePreview}:hover & {
    opacity: 1;
  }
`;

const ImageButton = styled(motion.button)`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: white;
  color: #4b5563;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);

  &:hover {
    background: #f8faff;
    color: #2563eb;
  }
`;

const LoadingOverlay = styled(motion.div)`
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;

  .loader {
    width: 40px;
    height: 40px;
    border: 3px solid #f3f3f3;
    border-top: 3px solid #3498db;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  p {
    color: #4b5563;
    font-size: 0.9rem;
    margin: 0;
  }
`;

interface ImageUploaderProps {
  onImageUpload: (imagePath: string) => void;
  currentImage?: string;
  onRemove?: () => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageUpload,
  currentImage,
  onRemove,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const baseUrl = BASE_URL;

  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploading(true);
      const response = await axiosInstance.post(
        "/api/images/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        // Use the original image path from the response
        onImageUpload(response.data.data.original);
        toast.success(response.data.message);
      } else {
        throw new Error(response.data.message || "Upload failed");
      }
    } catch (error) {
      toast.error("Failed to upload image");
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      handleUpload(file);
    }
  };

  const getImageUrl = (path: string) => {
    if (!path) return "";
    return path.startsWith("http") ? path : `${baseUrl}${path}`;
  };

  return (
    <UploaderContainer>
      <AnimatePresence mode="wait">
        {!currentImage && (
          <UploadArea
            $isDragging={isDragging}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => {
              const input = document.createElement("input");
              input.type = "file";
              input.accept = "image/*";
              input.onchange = (e) => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (file) handleUpload(file);
              };
              input.click();
            }}
          >
            <UploadIcon
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <FiUpload />
            </UploadIcon>
            <UploadText>
              <h4>Upload an Image</h4>
              <p>Drag and drop your image here or click to browse</p>
            </UploadText>
          </UploadArea>
        )}

        {currentImage && (
          <ImagePreview
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <PreviewImage src={getImageUrl(currentImage)} alt="Preview" />
            <ImageOverlay>
              <ImageButton
                onClick={() => {
                  const input = document.createElement("input");
                  input.type = "file";
                  input.accept = "image/*";
                  input.onchange = (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0];
                    if (file) handleUpload(file);
                  };
                  input.click();
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FiCamera size={18} />
              </ImageButton>
              {onRemove && (
                <ImageButton
                  onClick={onRemove}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FiX size={18} />
                </ImageButton>
              )}
            </ImageOverlay>
            {uploading && (
              <LoadingOverlay
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="loader" />
                <p>Uploading...</p>
              </LoadingOverlay>
            )}
          </ImagePreview>
        )}
      </AnimatePresence>
    </UploaderContainer>
  );
};

export default ImageUploader;
