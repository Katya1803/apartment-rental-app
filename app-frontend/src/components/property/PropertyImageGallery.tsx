// app-frontend/src/components/property/PropertyImageGallery.tsx
import React, { useState } from "react";
import {
  Box,
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";
import {
  Close as CloseIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
} from "@mui/icons-material";
import type { PropertyImage } from "../../types";

interface PropertyImageGalleryProps {
  images: PropertyImage[];
}

const PropertyImageGallery: React.FC<PropertyImageGalleryProps> = ({
  images,
}) => {
  const theme = useTheme();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const sortedImages = [...images].sort(
    (a, b) => a.displayOrder - b.displayOrder
  );

  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const handleClose = () => {
    setLightboxOpen(false);
  };

  const handlePrevious = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? sortedImages.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentImageIndex((prev) =>
      prev === sortedImages.length - 1 ? 0 : prev + 1
    );
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowLeft") {
      handlePrevious();
    } else if (event.key === "ArrowRight") {
      handleNext();
    } else if (event.key === "Escape") {
      handleClose();
    }
  };

  if (!sortedImages.length) {
    return (
      <Box
        sx={{
          height: 400,
          bgcolor: "grey.100",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 1,
        }}
      >
        <Typography color="text.secondary">No images available</Typography>
      </Box>
    );
  }

  return (
    <>
      <Box>
        {/* Main Image */}
        <Box
          sx={{
            position: "relative",
            height: 400,
            cursor: "pointer",
            borderRadius: 1,
            overflow: "hidden",
            mb: 2,
          }}
          onClick={() => handleImageClick(currentImageIndex)}
        >
          <img
            src={sortedImages[currentImageIndex].imageUrl}
            alt={sortedImages[currentImageIndex].originalName}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />

          {/* Navigation arrows */}
          {sortedImages.length > 1 && (
            <>
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevious();
                }}
                sx={{
                  position: "absolute",
                  left: 16,
                  top: "50%",
                  transform: "translateY(-50%)",
                  bgcolor: "rgba(255, 255, 255, 0.8)",
                  "&:hover": {
                    bgcolor: "rgba(255, 255, 255, 0.9)",
                  },
                }}
              >
                <ArrowBackIcon />
              </IconButton>

              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                sx={{
                  position: "absolute",
                  right: 16,
                  top: "50%",
                  transform: "translateY(-50%)",
                  bgcolor: "rgba(255, 255, 255, 0.8)",
                  "&:hover": {
                    bgcolor: "rgba(255, 255, 255, 0.9)",
                  },
                }}
              >
                <ArrowForwardIcon />
              </IconButton>
            </>
          )}

          {/* Image counter */}
          <Box
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
              bgcolor: "rgba(0, 0, 0, 0.6)",
              color: "white",
              px: 2,
              py: 0.5,
              borderRadius: 1,
              fontSize: "0.875rem",
            }}
          >
            {currentImageIndex + 1} / {sortedImages.length}
          </Box>
        </Box>

        {/* Thumbnail Navigation */}
        {sortedImages.length > 1 && (
          <Box
            sx={{
              display: "flex",
              gap: 1,
              overflowX: "auto",
              pb: 1,
              "&::-webkit-scrollbar": {
                height: 8,
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: "rgba(0,0,0,0.1)",
                borderRadius: 4,
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "rgba(0,0,0,0.3)",
                borderRadius: 4,
              },
            }}
          >
            {sortedImages.map((image, index) => (
              <Box
                key={image.id}
                onClick={() => setCurrentImageIndex(index)}
                sx={{
                  minWidth: 100,
                  width: 100,
                  height: 70,
                  cursor: "pointer",
                  borderRadius: 1,
                  overflow: "hidden",
                  border: 2,
                  borderColor:
                    currentImageIndex === index ? "primary.main" : "divider",
                  opacity: currentImageIndex === index ? 1 : 0.7,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    opacity: 1,
                    borderColor: "primary.main",
                  },
                  flexShrink: 0,
                }}
              >
                <img
                  src={image.imageUrl}
                  alt={image.originalName}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </Box>
            ))}
          </Box>
        )}
      </Box>

      {/* Lightbox Dialog */}
      <Dialog
        open={lightboxOpen}
        onClose={handleClose}
        maxWidth={false}
        fullWidth
        sx={{
          "& .MuiDialog-paper": {
            bgcolor: "rgba(0, 0, 0, 0.9)",
            boxShadow: "none",
            maxHeight: "100vh",
            maxWidth: "100vw",
            m: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          },
        }}
        onKeyDown={handleKeyDown}
      >
        <DialogContent
          sx={{
            p: 0,
            position: "relative",
            bgcolor: "transparent",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            width: "100vw",
          }}
        >
          {/* Close button */}
          <IconButton
            onClick={handleClose}
            sx={{
              position: "absolute",
              top: 40, // 👈 tăng khoảng cách
              right: 40, // 👈 tăng khoảng cách
              color: "white",
              bgcolor: "rgba(0, 0, 0, 0.6)",
              zIndex: 2,
              "&:hover": {
                bgcolor: "rgba(0, 0, 0, 0.8)",
              },
            }}
          >
            <CloseIcon />
          </IconButton>

          {/* Navigation arrows */}
          {sortedImages.length > 1 && (
            <>
              <IconButton
                onClick={handlePrevious}
                sx={{
                  position: "absolute",
                  left: 40, // 👈 tăng khoảng cách
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "white",
                  bgcolor: "rgba(0, 0, 0, 0.6)",
                  zIndex: 2,
                  "&:hover": {
                    bgcolor: "rgba(0, 0, 0, 0.8)",
                  },
                }}
              >
                <ArrowBackIcon />
              </IconButton>

              <IconButton
                onClick={handleNext}
                sx={{
                  position: "absolute",
                  right: 40, // 👈 tăng khoảng cách
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "white",
                  bgcolor: "rgba(0, 0, 0, 0.6)",
                  zIndex: 2,
                  "&:hover": {
                    bgcolor: "rgba(0, 0, 0, 0.8)",
                  },
                }}
              >
                <ArrowForwardIcon />
              </IconButton>
            </>
          )}

          {/* Current image */}
          <img
            src={sortedImages[currentImageIndex]?.imageUrl}
            alt={sortedImages[currentImageIndex]?.originalName}
            style={{
              maxWidth: "90vw",
              maxHeight: "90vh",
              objectFit: "contain",
              borderRadius: "8px",
            }}
          />

          {/* Image counter */}
          <Box
            sx={{
              position: "absolute",
              bottom: 20,
              left: "50%",
              transform: "translateX(-50%)",
              color: "white",
              bgcolor: "rgba(0, 0, 0, 0.6)",
              px: 2,
              py: 1,
              borderRadius: 1,
              backdropFilter: "blur(4px)",
            }}
          >
            <Typography variant="body2">
              {currentImageIndex + 1} / {sortedImages.length}
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PropertyImageGallery;
