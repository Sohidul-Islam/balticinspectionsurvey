import { motion } from "framer-motion";
import styled from "styled-components";
import image1 from "../../assets/images/image1.jpg";
import image2 from "../../assets/images/image2.jpg";
import image3 from "../../assets/images/image3.jpg";
import image4 from "../../assets/images/image4.jpg";

const GalleryContainer = styled.div`
  max-width: 1400px;
  margin: 4rem auto;
  padding: 0 2rem;
  width: 100%;
`;

const GalleryGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  padding: 1rem;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

export const ImageCard = styled(motion.div)`
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 15px 45px rgba(0, 0, 0, 0.2);
  background: #fff;
  aspect-ratio: 1;
  transform-origin: center;
  max-width: 300px;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to bottom,
      transparent 0%,
      rgba(0, 0, 0, 0.3) 100%
    );
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: 1;
  }

  &:hover::before {
    opacity: 1;
  }
`;

export const Image = styled(motion.img)`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform-origin: center;
`;

export const Overlay = styled(motion.div)`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 2rem;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.9) 0%,
    rgba(0, 0, 0, 0.7) 50%,
    transparent 100%
  );
  color: white;
  z-index: 2;
`;

export const Title = styled(motion.h3)`
  margin: 0;
  font-size: 1.4rem;
  font-weight: 700;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  line-height: 1.4;

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

export const Description = styled(motion.p)`
  margin: 0.5rem 0 0;
  font-size: 1rem;
  opacity: 0.9;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
`;

const images = [
  {
    src: image1,
    title: "Shipments Tracking & Notify to the client",
    description: "",
  },
  {
    src: image2,
    title: "Container Seal Checking",
    description: "",
  },
  {
    src: image3,
    title: "Container Seal breaking",
    description: "",
  },
  {
    src: image4,
    title: "Quantity Checked – devanning / Tallying",
    description: "",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

export const cardVariants = {
  hidden: {
    opacity: 0,
    y: 50,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12,
      mass: 0.5,
    },
  },
};

export const imageVariants = {
  hover: {
    scale: 1.15,
    transition: { duration: 0.4 },
  },
};

export const overlayVariants = {
  hover: {
    y: 0,
    opacity: 1,
    transition: {
      type: "tween",
      duration: 0.3,
    },
  },
  initial: {
    y: 20,
    opacity: 0,
  },
};

export const titleVariants = {
  hover: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.3 },
  },
  initial: {
    y: 20,
    opacity: 0,
  },
};

const Gallery = () => {
  return (
    <GalleryContainer>
      <GalleryGrid
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {images.map((image, index) => (
          <ImageCard
            key={index}
            variants={cardVariants}
            whileHover="hover"
            initial="initial"
            viewport={{ once: true }}
          >
            <Image
              src={image.src}
              alt={image.title}
              loading={index === 0 ? "eager" : "lazy"}
              variants={imageVariants}
            />
            <Overlay variants={overlayVariants}>
              <Title variants={titleVariants}>{image.title}</Title>
              {image.description && (
                <Description variants={titleVariants}>
                  {image.description}
                </Description>
              )}
            </Overlay>
          </ImageCard>
        ))}
      </GalleryGrid>
    </GalleryContainer>
  );
};

export default Gallery;
