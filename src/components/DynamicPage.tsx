import { useEffect, useState } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import {
  HeroSectionContainer,
  ImageGridSectionContainer,
  ListSectionContainer,
  TextSectionContainer,
} from "./DynamicRender";
import { demoOfRender, footerData } from "../mockup/componentsformate";
import Footer from "./Footer";

const PageContainer = styled.div`
  padding-top: 82px;
`;
// const PageContainer = styled.div`
//   max-width: 1200px;
//   margin: 0 auto;
//   padding: 2rem;
// `;

const Section = styled.section`
  margin-bottom: 3rem;
`;

const sectionComponents = {
  hero: HeroSectionContainer,
  text: TextSectionContainer,
  imageGrid: ImageGridSectionContainer,
  list: ListSectionContainer,
};

const DynamicPage = () => {
  const { path } = useParams();
  const [pageData, setPageData] = useState(null);

  useEffect(() => {
    // Fetch page data based on path
  }, [path]);

  return (
    <PageContainer>
      {demoOfRender.sections.map((section, index) => {
        const SectionComponent =
          sectionComponents[section.type as keyof typeof sectionComponents];
        return (
          <SectionComponent
            key={index}
            data={section.data as unknown as any}
            variant="secondary"
          />
        );
      })}

      <Footer data={footerData} />
    </PageContainer>
  );
};

export default DynamicPage;
