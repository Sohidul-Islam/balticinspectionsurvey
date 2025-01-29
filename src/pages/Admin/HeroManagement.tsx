import React, { useState } from "react";
import HeroSettings from "../../components/Admin/HeroSettings";

type HeroSettings = {
  enableSliding: boolean;
  banners: any[];
};

const HeroManagement: React.FC = () => {
  const [heroSettings, setHeroSettings] = useState<HeroSettings>({
    enableSliding: false,
    banners: [],
  });

  return (
    <HeroSettings
      enableSliding={heroSettings.enableSliding}
      onToggleSliding={() => {}}
      banners={heroSettings.banners}
      onUpdateBanners={() => {}}
    />
  );
};

export default HeroManagement;
