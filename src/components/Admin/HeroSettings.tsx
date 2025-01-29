import React from "react";
import styled from "styled-components";

interface HeroSettingsProps {
  enableSliding: boolean;
  onToggleSliding: (value: boolean) => void;
  banners: Array<{
    id: string;
    image: string;
    title: string;
    description: string;
  }>;
  onUpdateBanners: (banners: any[]) => void;
}

const HeroSettings: React.FC<HeroSettingsProps> = ({
  enableSliding,
  onToggleSliding,
  banners,
  onUpdateBanners,
}) => {
  return (
    <SettingsContainer>
      <SettingsHeader>
        <h2>Hero Section Settings</h2>
      </SettingsHeader>

      <SettingsGroup>
        <SettingsLabel>
          <input
            type="checkbox"
            checked={enableSliding}
            onChange={(e) => onToggleSliding(e.target.checked)}
          />
          Enable Banner Sliding
        </SettingsLabel>
      </SettingsGroup>

      <BannerList>
        {banners.map((banner, index) => (
          <BannerItem key={banner.id}>
            <BannerPreview>
              <img src={banner.image} alt={banner.title} />
            </BannerPreview>
            <BannerDetails>
              <input
                type="text"
                value={banner.title}
                onChange={(e) => {
                  const newBanners = [...banners];
                  newBanners[index] = { ...banner, title: e.target.value };
                  onUpdateBanners(newBanners);
                }}
                placeholder="Banner Title"
              />
              <textarea
                value={banner.description}
                onChange={(e) => {
                  const newBanners = [...banners];
                  newBanners[index] = {
                    ...banner,
                    description: e.target.value,
                  };
                  onUpdateBanners(newBanners);
                }}
                placeholder="Banner Description"
              />
            </BannerDetails>
          </BannerItem>
        ))}
      </BannerList>
    </SettingsContainer>
  );
};

const SettingsContainer = styled.div`
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const SettingsHeader = styled.div`
  margin-bottom: 2rem;

  h2 {
    font-size: 1.5rem;
    color: #333;
  }
`;

const SettingsGroup = styled.div`
  margin-bottom: 2rem;
`;

const SettingsLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  color: #666;

  input[type="checkbox"] {
    width: 20px;
    height: 20px;
  }
`;

const BannerList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const BannerItem = styled.div`
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid #eee;
  border-radius: 4px;
`;

const BannerPreview = styled.div`
  width: 200px;
  height: 120px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 4px;
  }
`;

const BannerDetails = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  input,
  textarea {
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
  }

  textarea {
    height: 80px;
    resize: vertical;
  }
`;

export default HeroSettings;
