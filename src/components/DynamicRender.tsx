import { useState } from "react";
import { motion } from "framer-motion";
import styled from "styled-components";
import {
  HeroSectionSlider,
  type HeroSection,
  type ImageGridSection,
  type ListSection,
  type TextSection,
} from "../types/GlobalTypes";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/swiper-bundle.css";
import {
  Description,
  Image,
  imageVariants,
  Overlay,
  overlayVariants,
  titleVariants,
} from "../views/UnderDevelopment/Gallery";

import { Swiper, SwiperSlide } from "swiper/react";
import { NavLink } from "react-router-dom";

export const ServiceCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  cursor: pointer;
  transition: transform 0.3s ease;
  border: 1px solid #eeee;
  transition: all 0.5s linear;

  &:hover {
    transform: scale(1.025);
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
  }

  img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: 8px;
    margin-bottom: 1rem;
  }

  h4 {
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
    color: #000;
    font-weight: 700;
  }

  p {
    font-size: 0.9rem;
    opacity: 0.8;
    line-height: 1.6;
    color: #000;
  }
`;

export const Title = styled(motion.h1)`
  font-size: 2.5rem;
  color: #fff;
  margin-bottom: 1rem;
  font-weight: 700;
`;

// Styled Components
const HeroWrapper = styled(motion.div)`
  position: relative;
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      to right,
      rgba(0, 0, 0, 0.8),
      rgba(0, 0, 0, 0.4)
    );
    z-index: 1;
  }
`;

const HeroContent = styled(motion.div)`
  position: relative;
  z-index: 2;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
`;

const HeroImage = styled(motion.img)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const HeroTitle = styled(motion.h1)`
  font-size: clamp(2.5rem, 5vw, 4.5rem);
  font-weight: 800;
  margin-bottom: 1.5rem;
  line-height: 1.2;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
`;

const HeroSubtitle = styled(motion.p)`
  font-size: clamp(1.1rem, 2vw, 1.5rem);
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.6;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
`;

// hero slider

const HeroSliderImage = styled(motion.img)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const HeroSliderWrapper = styled(motion.div)`
  position: relative;
  height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      to right,
      rgba(0, 0, 0, 0.8),
      rgba(0, 0, 0, 0.4)
    );
    z-index: 1;
  }
`;

const TextWrapper = styled(motion.section)`
  max-width: 1200px;
  margin: 4rem auto;
  padding: 0 2rem;
`;

const TextContentWrapper = styled(motion.div)<{ position?: "right" | "left" }>`
  display: flex;
  flex-direction: ${({ position }) =>
    position === "right" ? "row" : "row-reverse"};
  gap: 3rem;
  align-items: center;

  @media (max-width: 968px) {
    flex-direction: column;
    gap: 2rem;
  }
`;

const TextContent = styled(motion.div)`
  font-size: 1.1rem;
  line-height: 1.8;
  color: #636e72;
`;

const ImageContainer = styled(motion.div)`
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  transform-origin: center;
  min-width: min(80vw, 300px);

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      45deg,
      rgba(0, 0, 0, 0.1) 0%,
      rgba(255, 255, 255, 0.1) 100%
    );
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover::after {
    opacity: 1;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.6s ease;
  }

  &:hover img {
    transform: scale(1.05);
  }

  @media (max-width: 968px) {
    max-width: 600px;
    margin: 0 auto;
  }
`;

export const TextHeadingWrapper = styled.div`
  margin-bottom: 2rem;
`;

export const TextHeading = styled(motion.h2)`
  font-size: clamp(2rem, 3vw, 2.5rem);
  font-weight: 700;
  color: #2d3436;
  margin-bottom: 1rem;
  position: relative;
  display: inline-block;
  padding-bottom: 1rem;

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: linear-gradient(to right, #2d3436, #636e72);
    border-radius: 2px;
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.6s ease;
  }

  &.visible::after {
    transform: scaleX(1);
  }
`;

const ImageGridWrapper = styled(motion.section)`
  max-width: 1400px;
  margin: 4rem auto;
  padding: 0 2rem;
  color: white;
`;

export const ImageGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const ImageCard = styled(motion.div)`
  position: relative;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  aspect-ratio: 3/4;
  cursor: pointer;

  &:hover img {
    transform: scale(1.1);
  }
`;

const ListWrapper = styled(motion.section)`
  max-width: 1200px;
  margin: 4rem auto;
  padding: 0 2rem;
`;

const ListContainer = styled(motion.ul)`
  list-style: none;
  padding: 0;
  margin-top: 2rem;
`;

const ListItem = styled(motion.li)`
  padding: 1.5rem;
  background: white;
  border-radius: 12px;
  margin-bottom: 1rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const staggerChildren = {
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Component implementations
export const HeroSectionContainer = ({
  data,
}: {
  data: HeroSection["data"];
}) => (
  <HeroWrapper initial="hidden" animate="visible" variants={fadeInUp}>
    <HeroImage
      src={data.image}
      alt="Hero"
      initial={{ scale: 1.1 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.8 }}
    />
    <HeroContent>
      <HeroTitle
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        {data.heading}
      </HeroTitle>
      {/* <HeroSubtitle
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        {data.subheading}
      </HeroSubtitle> */}

      <NavLink
        to={data?.redirectPath || "#"}
        className="group relative inline-block text-white hover:text-white"
      >
        <HeroSubtitle
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <span
            className="
      inline-block
      transition-all
      duration-300
      group-hover:translate-y-[-2px]
      group-hover:opacity-90
      after:absolute
      after:bottom-0
      after:left-0
      after:h-[2px]
      after:w-0
      after:bg-white
      after:transition-all
      after:duration-300
      group-hover:after:w-full
    "
          >
            {data.subheading}
          </span>
        </HeroSubtitle>
      </NavLink>
    </HeroContent>
  </HeroWrapper>
);

export const HeroSectionContainerSecondary = ({
  data,
}: {
  data: HeroSectionSlider["data"];
}) => (
  <Swiper
    modules={[Autoplay, Navigation, Pagination]}
    spaceBetween={0}
    slidesPerView={1}
    navigation
    pagination={{ clickable: true }}
    autoplay={{
      delay: 5000,
      disableOnInteraction: false,
    }}
    loop={true}
  >
    {data.heroImages.map((banner, key) => (
      <SwiperSlide key={key}>
        <HeroSliderWrapper
          initial="hidden"
          // className="absolute"
          animate="visible"
          variants={fadeInUp}
        >
          <HeroSliderImage
            src={banner.image}
            alt="Hero"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8 }}
          />
          <HeroContent>
            <HeroTitle
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              {banner.heading}
            </HeroTitle>
            <NavLink
              to={banner?.redirectPath || "#"}
              className="group relative inline-block text-white hover:text-white"
            >
              <HeroSubtitle
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <span
                  className="
      inline-block
      transition-all
      duration-300
      group-hover:translate-y-[-2px]
      group-hover:opacity-90
      after:absolute
      after:bottom-0
      after:left-0
      after:h-[2px]
      after:w-0
      after:bg-white
      after:transition-all
      after:duration-300
      group-hover:after:w-full
    "
                >
                  {banner.subheading}
                </span>
              </HeroSubtitle>
            </NavLink>
          </HeroContent>
        </HeroSliderWrapper>
      </SwiperSlide>
    ))}
  </Swiper>
);

export const TextSectionContainer = ({
  data,
}: {
  data: TextSection["data"] & { image?: string };
}) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <TextWrapper
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      onViewportEnter={() => setIsVisible(true)}
    >
      <TextHeadingWrapper>
        <TextHeading className={isVisible ? "visible" : ""}>
          {data?.heading || data?.title}
        </TextHeading>
      </TextHeadingWrapper>

      <TextContentWrapper
        className={data.image ? `with-image` : ""}
        position={data.position}
      >
        <TextContent
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.6 }}
        >
          {data.content}
        </TextContent>

        {data.image && (
          <ImageContainer
            variants={{
              hidden: { opacity: 0, scale: 0.8, x: 50 },
              visible: {
                opacity: 1,
                scale: 1,
                x: 0,
                transition: {
                  type: "spring",
                  stiffness: 100,
                  damping: 20,
                  mass: 1,
                },
              },
            }}
          >
            <motion.img
              src={data.image}
              alt={data.heading}
              loading="lazy"
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8 }}
            />
          </ImageContainer>
        )}
      </TextContentWrapper>
    </TextWrapper>
  );
};

export const ImageGridSectionContainer = ({
  data,
  variant = "primary",
}: {
  data: ImageGridSection["data"];
  variant?: "primary" | "secondary";
}) => (
  <ImageGridWrapper
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true }}
    variants={staggerChildren}
  >
    <TextHeading>{data.caption || data?.title}</TextHeading>
    <ImageGrid>
      {/* {data.images.map((image, index) => (
        <ImageCard key={index} variants={fadeInUp} whileHover={{ y: -10 }}>
          <GridImage src={image.src} alt={`Grid ${index + 1}`} />
        </ImageCard>
      ))} */}

      {data?.images?.map((image, index) =>
        variant === "primary" ? (
          <ImageCard
            key={index}
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
              <Title className="!text-white" variants={titleVariants}>
                {image.title}
              </Title>
              {image.description && (
                <Description
                  className="!text-white line-clamp-1 text-ellipsis"
                  variants={titleVariants}
                >
                  {image.description}
                </Description>
              )}
            </Overlay>
          </ImageCard>
        ) : (
          <ServiceCard
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <img src={image.src} alt={image.title} />
            <h4>{image.title}</h4>
            <p className="line-clamp-2 text-ellipsis">{image.description}</p>
          </ServiceCard>
        )
      )}
    </ImageGrid>
  </ImageGridWrapper>
);

export const ListSectionContainer = ({
  data,
}: {
  data: ListSection["data"];
}) => (
  <ListWrapper
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true }}
    variants={staggerChildren}
  >
    <TextHeadingWrapper>
      <TextHeading className="visible">
        {data.heading || data?.title}
      </TextHeading>
    </TextHeadingWrapper>
    <ListContainer>
      {data.items.map((item, index) => (
        <ListItem key={index} variants={fadeInUp} whileHover={{ x: 10 }}>
          {item}
        </ListItem>
      ))}
    </ListContainer>
  </ListWrapper>
);
