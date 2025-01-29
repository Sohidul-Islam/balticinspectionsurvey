import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/swiper-bundle.css";
import styled from "styled-components";

interface HeroSectionProps {
  banners: Array<{
    id: string;
    image: string;
    title: string;
    description: string;
  }>;
  enableSliding: boolean;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  banners,
  enableSliding,
}) => {
  if (!enableSliding) {
    // If sliding is disabled, show only the first banner
    return (
      <HeroContainer>
        <SingleBanner>
          <BannerImage src={banners[0]?.image} alt={banners[0]?.title} />
          <BannerContent>
            <h1>{banners[0]?.title}</h1>
            <p>{banners[0]?.description}</p>
          </BannerContent>
        </SingleBanner>
      </HeroContainer>
    );
  }

  return (
    <HeroContainer>
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
        {banners.map((banner) => (
          <SwiperSlide key={banner.id}>
            <BannerImage src={banner.image} alt={banner.title} />
            <BannerContent>
              <h1>{banner.title}</h1>
              <p>{banner.description}</p>
            </BannerContent>
          </SwiperSlide>
        ))}
      </Swiper>
    </HeroContainer>
  );
};

const HeroContainer = styled.div`
  width: 100%;
  height: 100vh;
  position: relative;
`;

const BannerImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const BannerContent = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: white;
  z-index: 2;

  h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.2rem;
  }
`;

const SingleBanner = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

export default HeroSection;
