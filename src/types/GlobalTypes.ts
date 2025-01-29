export type HeroSection = {
  type: "hero";
  data: {
    image: string;
    heading: string;
    subheading: string;
  };
};

export type HeroSectionSlider = {
  type: "hero";
  data: {
    heroImages: {
      heading: string;
      subheading: string;
      image: string;
      redirectPath: string;
    }[];
  };
};

export type TextSection = {
  type: "text";
  data: {
    heading?: string;
    title?: string;
    content: string;
    image?: string;
    position?: "right" | "left";
  };
};

export type ImageGridSection = {
  type: "imageGrid";
  data: {
    images: {
      src: string;
      title: string;
      description: string;
    }[];
    caption: string;
  };
};

export type ListSection = {
  type: "list";
  data: {
    heading: string;
    title?: string;
    items: string[];
  };
};

export interface FooterSection {
  type: "footer";
  data: {
    addresses: Address[];
    keyServices: KeyService[];
    contactInfo: ContactInfo;
    socialLinks: SocialLink[];
  };
}

export interface Address {
  id: string;
  title: string;
  street: string;
  city: string;
  country: string;
  phone: string[];
  email: string;
}

export interface KeyService {
  id: string;
  title: string;
  description: string;
  image: string;
}

export interface ContactInfo {
  phones: string[];
  emails: string[];
  website: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

// Union type for all possible section types
export type Section =
  | HeroSection
  | TextSection
  | ImageGridSection
  | ListSection
  | FooterSection;

// Main type for the data structure
export interface DemoRender {
  title: string;
  sections: (
    | HeroSection
    | TextSection
    | ImageGridSection
    | ListSection
    | FooterSection
  )[];
}
