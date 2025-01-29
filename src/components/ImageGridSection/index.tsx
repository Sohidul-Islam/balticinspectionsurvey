import React, { useRef, useState } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";

interface ImageGridSectionProps {
  data: {
    title: string;
    image1: string;
    image2: string;
    image3: string;
    description: string;
  };
}

const ImageGridSection: React.FC<ImageGridSectionProps> = ({ data }) => {
  const [hoveredImage, setHoveredImage] = useState<number | null>(null);
  const paragraphs = data.description.split("\n\n");

  const ref = useRef(null);
  const onClickScrollViewRef = () => {
    (ref.current as unknown as HTMLElement)?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  };

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
          <SubTitle>Discover Our Gallery</SubTitle>
        </Header>

        <GalleryGrid>
          <MainImageWrapper
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            onHoverStart={() => setHoveredImage(1)}
            onHoverEnd={() => setHoveredImage(null)}
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
                      <ViewDetailsButton onClick={onClickScrollViewRef}>
                        <span>View Details</span>
                        <Arrow>→</Arrow>
                      </ViewDetailsButton>
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
                onHoverEnd={() => setHoveredImage(null)}
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
                          <ViewDetailsButton onClick={onClickScrollViewRef}>
                            <span>View Details</span>
                            <Arrow>→</Arrow>
                          </ViewDetailsButton>
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
    </Container>
  );
};

const Container = styled.section`
  padding: 8rem 2rem;
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
  font-size: 3.5rem;
  color: #1a1a1a;
  margin-bottom: 1rem;
  font-weight: 800;
  letter-spacing: -1px;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const SubTitle = styled.p`
  font-size: 1.2rem;
  color: #666;
  font-weight: 500;
`;

const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 2rem;
  margin-bottom: 4rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const ImageWrapper = styled(motion.div)`
  border-radius: 24px;
  overflow: hidden;
  position: relative;
  cursor: pointer;
`;

const MainImageWrapper = styled(ImageWrapper)`
  height: 600px;

  @media (max-width: 1024px) {
    height: 400px;
  }
`;

const SideImagesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const SideImageWrapper = styled(ImageWrapper)`
  height: 290px;

  @media (max-width: 1024px) {
    height: 300px;
  }
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const StyledImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.215, 0.61, 0.355, 1);

  ${ImageContainer}:hover & {
    transform: scale(1.05);
  }
`;

const OverlayMotion = styled(motion.div)`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.7) 100%
  );
  display: flex;
  align-items: flex-end;
  padding: 2.5rem;
`;

const OverlayContent = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
`;

const ImageNumber = styled.span`
  font-size: 2.5rem;
  font-weight: 700;
  opacity: 0.9;
  font-family: "Playfair Display", serif;
`;

const ViewDetailsButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  padding: 0.8rem 1.5rem;
  border-radius: 50px;
  font-size: 0.9rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  backdrop-filter: blur(5px);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateX(5px);
  }
`;

const Arrow = styled.span`
  font-size: 1.2rem;
  transition: transform 0.3s ease;

  ${ViewDetailsButton}:hover & {
    transform: translateX(3px);
  }
`;

const TextContent = styled(motion.div)`
  margin: 1.5rem auto 0;
`;

const Description = styled.p`
  font-size: 1.1rem;
  line-height: 1.8;
  color: #4a4a4a;
  margin-bottom: 1.5rem;
  white-space: pre-wrap;

  &:last-child {
    margin-bottom: 0;
  }
`;

export default ImageGridSection;
