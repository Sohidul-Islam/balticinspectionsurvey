import React, { useState, useEffect } from "react";
import HeroSection from "../components/HeroSection";

type HeroSettings = {
  enableSliding: boolean;
  banners: any[];
};

const Home: React.FC = () => {
  const [heroSettings, setHeroSettings] = useState<HeroSettings>({
    enableSliding: false,
    banners: [],
  });

  return (
    <div>
      <HeroSection
        banners={heroSettings.banners}
        enableSliding={heroSettings.enableSliding}
      />
      {/* Other components */}
    </div>
  );
};

export default Home;
