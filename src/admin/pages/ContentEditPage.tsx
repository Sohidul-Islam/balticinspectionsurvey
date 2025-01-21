import { useEffect, useState } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { useContent, useUpdateContent } from "../../services/contentApi";
import { Loader } from "../components/Loader";
import ContentEditor from "../components/ContentEditor";

import axiosInstance from "../../services/axios";
import { useQuery } from "@tanstack/react-query";

const Container = styled.div`
  padding: 2rem;
`;

const ContentEditPage = () => {
  const { contentId } = useParams();
  //   const { data: contentData, isLoading } = useContent(contentId); // Fetch content by contentId

  const { data: contentData, isLoading } = useQuery({
    queryKey: ["content", contentId],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/api/content`, {
        params: {
          contentId: contentId,
        },
      });
      return data?.data[0] || null;
    },
  });

  const updateContent = useUpdateContent();
  const [sections, setSections] = useState([]);

  useEffect(() => {
    if (contentData?.sections) {
      setSections(contentData?.sections || []); // Set sections from fetched content
    }
  }, [contentData]);

  const handleSave = async (contentData: any) => {
    try {
      await updateContent.mutateAsync({
        id: contentId,
        ...contentData,
      });
    } catch (error) {
      console.error("Error updating content:", error);
    }
  };

  console.log({ data: contentData, sections });

  if (isLoading) return <Loader />;

  return (
    <Container>
      <h1>Edit Content</h1>
      <ContentEditor
        onSave={handleSave}
        initialContent={{
          title: contentData?.title || "",
          sections: contentData?.sections,
        }}
      />
    </Container>
  );
};

export default ContentEditPage;
