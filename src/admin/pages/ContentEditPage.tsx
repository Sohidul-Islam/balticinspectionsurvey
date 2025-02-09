import { useEffect, useState } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { useUpdateContent } from "../../services/contentApi";
import { Loader } from "../components/Loader";
import ContentEditor from "../components/ContentEditor";

import axiosInstance from "../../services/axios";
import { useQuery } from "@tanstack/react-query";
import { parseIfJson } from "../../utils";
import ContentPreviewSecondary from "../components/ContentPreviewSecondary";

const Container = styled.div`
  padding: 2rem;
  @media (max-width: 768px) {
    padding: 0rem;
  }
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
      return parseIfJson(data?.data[0]) || null;
    },
  });

  const updateContent = useUpdateContent();
  const [sections, setSections] = useState([]);

  console.log({ sections });

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

  if (isLoading) return <Loader />;

  return (
    <Container>
      <h1>Edit Content</h1>
      <div className="grid grid-cols-1  lg:grid-cols-3 gap-x-4">
        <div className="col-span-1 lg:col-span-2">
          <ContentEditor
            onSave={handleSave}
            initialContent={{
              title: contentData?.title || "",
              sections: contentData?.sections,
            }}
          />
        </div>

        <ContentPreviewSecondary sections={contentData?.sections} />
      </div>
    </Container>
  );
};

export default ContentEditPage;
