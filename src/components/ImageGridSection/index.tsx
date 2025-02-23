import React, { useRef, useState } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import ServiceModal from "../SharedModal/ServiceModal";

interface ImageGridSectionProps {
  data: {
    title: string;
    subtitle: string;
    image1: string;
    image2: string;
    image3: string;
    description: string;
  };
}

const ImageGridSection: React.FC<ImageGridSectionProps> = ({ data }) => {
  const [hoveredImage, setHoveredImage] = useState<number | null>(null);
  const paragraphs = data.description.split("\n");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const ref = useRef(null);
  // const onClickScrollViewRef = () => {
  //   setIsModalOpen(true);
  //   (ref.current as unknown as HTMLElement)?.scrollIntoView({
  //     behavior: "smooth",
  //     block: "nearest",
  //   });
  // };

  return (
    <Container>
      <ContentWrapper>
        <Header
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Title>{data.title}</Title>
          <SubTitle>{data?.subtitle}</SubTitle>
        </Header>

        <GalleryGrid>
          <MainImageWrapper
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            onHoverStart={() => setHoveredImage(1)}
            // onHoverEnd={() => setHoveredImage(null)}
          >
            <ImageContainer>
              <StyledImage src={data.image1} alt="Main Image" />
              <AnimatePresence>
                {hoveredImage === 1 && (
                  <OverlayMotion
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <OverlayContent>
                      <ImageNumber>01</ImageNumber>
                      {/* <ViewDetailsButton onClick={onClickScrollViewRef}>
                        <span>View Details</span>
                        <Arrow>→</Arrow>
                      </ViewDetailsButton> */}
                    </OverlayContent>
                  </OverlayMotion>
                )}
              </AnimatePresence>
            </ImageContainer>
          </MainImageWrapper>

          <SideImagesContainer>
            {[data.image2, data.image3].map((image, index) => (
              <SideImageWrapper
                key={index}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 * (index + 1) }}
                onHoverStart={() => setHoveredImage(index + 2)}
                // onHoverEnd={() => setHoveredImage(null)}
              >
                <ImageContainer>
                  <StyledImage src={image} alt={`Side Image ${index + 1}`} />
                  <AnimatePresence>
                    {hoveredImage === index + 2 && (
                      <OverlayMotion
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <OverlayContent>
                          <ImageNumber>{`0${index + 2}`}</ImageNumber>
                          {/* <ViewDetailsButton onClick={onClickScrollViewRef}>
                            <span>View Details</span>
                            <Arrow>→</Arrow>
                          </ViewDetailsButton> */}
                        </OverlayContent>
                      </OverlayMotion>
                    )}
                  </AnimatePresence>
                </ImageContainer>
              </SideImageWrapper>
            ))}
          </SideImagesContainer>
        </GalleryGrid>

        <TextContent
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.7 }}
          ref={ref}
        >
          {paragraphs.map((paragraph, index) => (
            <Description key={index}>{paragraph}</Description>
          ))}
        </TextContent>
      </ContentWrapper>

      <ServiceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={data.title}
        description={data.description}
        image={data[`image${hoveredImage || 1}` as keyof typeof data]}
      />
    </Container>
  );
};

const Container = styled.section`
  padding: 4rem 2rem;
  background: #ffffff;
  overflow: hidden;
`;

const ContentWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const Header = styled(motion.div)`
  text-align: center;
  margin-bottom: 5rem;
`;

const Title = styled.h2`
  font-size: 2.5rem;
  font-weight: bold;
  color: #1a202c;
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
`;

const SubTitle = styled.p`
  font-size: 1.2rem;
  color: #4a5568;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 1.5rem;
  }
`;

const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const ImageWrapper = styled(motion.div)`
  border-radius: 24px;
  overflow: hidden;
  position: relative;
  cursor: pointer;
`;

const MainImageWrapper = styled(ImageWrapper)`
  height: 500px;

  @media (max-width: 768px) {
    height: 300px;
  }
`;

const SideImagesContainer = styled.div`
  display: grid;
  grid-template-rows: 1fr 1fr;
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-rows: 1fr;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }
`;

const SideImageWrapper = styled(ImageWrapper)`
  height: 240px;

  @media (max-width: 768px) {
    height: 200px;
  }
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 20px;
  overflow: hidden;
`;

const StyledImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
`;

const OverlayMotion = styled(motion.div)`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const OverlayContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
`;

const ImageNumber = styled.span`
  font-size: 1.5rem;
  font-weight: bold;
  color: white;

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

// const ViewDetailsButton = styled.button`
//   display: flex;
//   align-items: center;
//   gap: 0.5rem;
//   background: none;
//   border: none;
//   color: white;
//   font-size: 1rem;
//   cursor: pointer;

//   @media (max-width: 768px) {
//     font-size: 0.9rem;
//   }
// `;

// const Arrow = styled.span`
//   font-size: 1.2rem;
//   transition: transform 0.3s ease;

//   ${ViewDetailsButton}:hover & {
//     transform: translateX(3px);
//   }
// `;

const TextContent = styled(motion.div)`
  // padding: 0 1rem;
  margin: 3rem auto;

  @media (max-width: 768px) {
    margin: 2rem auto;
  }
`;

const Description = styled.p`
  font-size: 1.1rem;
  line-height: 1.85rem;
  color: #4a5568;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    font-size: 1rem;
    line-height: 1.6;
  }
`;

export default ImageGridSection;
