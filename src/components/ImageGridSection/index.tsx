import React, { useRef } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

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
          <Divider />
        </Header>

        <ImageGallery>
          <MainImageContainer
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <MainImage src={data.image1} alt="Main Image" />
            <ImageOverlay>
              <OverlayContent>
                <ImageCount>01</ImageCount>
                <ViewMore onClick={onClickScrollViewRef}>View Details</ViewMore>
              </OverlayContent>
            </ImageOverlay>
          </MainImageContainer>

          <SideImagesContainer>
            <SideImageContainer
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <SideImage src={data.image2} alt="Side Image 1" />
              <ImageOverlay>
                <OverlayContent>
                  <ImageCount>02</ImageCount>
                  <ViewMore onClick={onClickScrollViewRef}>
                    View Details
                  </ViewMore>
                </OverlayContent>
              </ImageOverlay>
            </SideImageContainer>

            <SideImageContainer
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <SideImage src={data.image3} alt="Side Image 2" />
              <ImageOverlay>
                <OverlayContent>
                  <ImageCount>03</ImageCount>
                  <ViewMore onClick={onClickScrollViewRef}>
                    View Details
                  </ViewMore>
                </OverlayContent>
              </ImageOverlay>
            </SideImageContainer>
          </SideImagesContainer>
        </ImageGallery>

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
  padding: 6rem 2rem;
  background: #f8f9fa;
  overflow: hidden;
`;

const ContentWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const Header = styled(motion.div)`
  text-align: center;
  margin-bottom: 4rem;
`;

const Title = styled.h2`
  font-size: 3rem;
  color: #1a1a1a;
  margin-bottom: 1rem;
  font-weight: 800;
  letter-spacing: -0.5px;

  @media (max-width: 768px) {
    font-size: 2.2rem;
  }
`;

const Divider = styled.div`
  width: 60px;
  height: 4px;
  background: #3498db;
  margin: 1rem auto;
  border-radius: 2px;
`;

const ImageGallery = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  margin-bottom: 4rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const MainImageContainer = styled(motion.div)`
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  aspect-ratio: 16/9;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  cursor: pointer;

  &:hover {
    img {
      transform: scale(1.05);
    }

    div {
      opacity: 1;
    }
  }
`;

const MainImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
`;

const SideImagesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const SideImageContainer = styled(motion.div)`
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  aspect-ratio: 4/3;
  box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.2);
  cursor: pointer;

  &:hover {
    img {
      transform: scale(1.05);
    }

    div {
      opacity: 1;
    }
  }
`;

const SideImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
`;

const ImageOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.1) 0%,
    rgba(0, 0, 0, 0.6) 100%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
  display: flex;
  align-items: flex-end;
  padding: 2rem;
`;

const OverlayContent = styled.div`
  color: white;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ImageCount = styled.span`
  font-size: 2rem;
  font-weight: 700;
  opacity: 0.8;
`;

const ViewMore = styled.span`
  font-size: 1rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1px;
  position: relative;
  padding-bottom: 4px;

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: white;
    transform: scaleX(0);
    transform-origin: right;
    transition: transform 0.3s ease;
  }

  &:hover::after {
    transform: scaleX(1);
    transform-origin: left;
  }
`;

const TextContent = styled(motion.div)`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
`;

const Description = styled.p`
  font-size: 1.1rem;
  line-height: 1.8;
  color: #4a4a4a;
  margin-bottom: 2rem;
  white-space: pre-wrap;

  &:last-child {
    margin-bottom: 0;
  }
`;

export default ImageGridSection;
