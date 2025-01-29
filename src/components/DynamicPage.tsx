import { Fragment, useEffect, useState } from "react";
import styled from "styled-components";
import { useLocation, useParams } from "react-router-dom";
import {
  HeroSectionContainer,
  HeroSectionContainerSecondary,
  ImageGridSectionContainer,
  ListSectionContainer,
  TextSectionContainer,
} from "./DynamicRender";
import { demoOfRender, footerData } from "../mockup/componentsformate";
import Footer from "./Footer";
import axiosInstance from "../services/axios";
import { Loader } from "../admin/components/Loader";
import { useQuery } from "@tanstack/react-query";

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

export const sectionComponents = {
  hero: HeroSectionContainer,
  heroSlider: HeroSectionContainerSecondary,
  text: TextSectionContainer,
  imageGrid: ImageGridSectionContainer,
  services: ImageGridSectionContainer,
  list: ListSectionContainer,
};

const DynamicPage = () => {
  const location = useLocation();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  const { data, isLoading, error } = useQuery({
    queryKey: ["content", { path: location.pathname }],
    queryFn: async () =>
      axiosInstance
        .get(`/api/content/page`, { params: { path: location.pathname } })
        .then((res) => res.data.data),
  });

  console.log({ data, isLoading, error });

  // useEffect(() => {
  //   const fetchContent = async () => {
  //     try {
  //       const response = await axiosInstance.get(`/api/content`, {
  //         params: { path },
  //       });
  //       setContent(response.data.data);
  //     } catch (error) {
  //       console.error("Error fetching content:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   if (isLoading) return <Loader />;
  //   if (error) return <div>Error fetching content: {error.message}</div>;

  //   fetchContent();
  // }, [path]);

  if (isLoading) return <Loader />;

  return (
    <PageContainer>
      {/* {data.map((sections: any[], index: number) => (
        <Fragment key={index}>
          {sections?.map((section: any, index: number) => {
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
        </Fragment>
      ))} */}
      {data.map(({ sections }: any, index: number) => {
        console.log({ sections });
        if (!Array.isArray(sections)) return null; // Ensure `dataEle` is an array

        return sections.map((section: any, key: number) => {
          // Get the corresponding component for the section type

          const SectionComponent =
            sectionComponents[section?.type as keyof typeof sectionComponents];

          if (!SectionComponent) {
            console.warn(
              `No component found for section type: ${section.type}`
            );
            return null; // Skip rendering if no component is found
          }

          return (
            <SectionComponent
              key={`section-${index}-${key}`} // Use a unique key
              data={section.data}
              variant="secondary"
            />
          );
        });
      })}

      {/* {demoOfRender.sections?.map((section: any, index: number) => {
        const SectionComponent =
          sectionComponents[section.type as keyof typeof sectionComponents];
        return (
          <SectionComponent
            key={index}
            data={section.data as unknown as any}
            variant="secondary"
          />
        );
      })} */}

      <Footer data={footerData} />
    </PageContainer>
  );
};

export default DynamicPage;
